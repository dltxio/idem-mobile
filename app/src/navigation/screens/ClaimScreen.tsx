import * as React from "react";
import moment from "moment";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Keyboard,
  Text,
  Alert,
  ScrollView,
  KeyboardTypeOptions,
  StatusBar,
  Pressable,
  Modal
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { extractPrivateKeyFromContent } from "../../utils/pgp-utils";
import * as DocumentPicker from "expo-document-picker";
import usePgp from "../../hooks/usePpg";
import Dialog from "react-native-dialog";
import { Input, Switch } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import commonStyles from "../../styles/styles";
import {
  ProfileStackNavigation,
  ProfileStackNavigationRoute
} from "../../types/navigation";
import * as FileSystem from "expo-file-system";
import { getClaimFromType } from "../../utils/claim-utils";
import { Claim, RequestOptResponse } from "../../types/claim";
import { FileList, Button } from "../../components";
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import { useDocumentStore } from "../../context/DocumentStore";
import { getDocumentFromDocumentType } from "../../utils/document-utils";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import useClaimScreen from "../../hooks/useClaimScreen";
import { claimsLocalStorage, pgpLocalStorage } from "../../utils/local-storage";
import useApi from "../../hooks/useApi";
import { AlertTitle, ClaimTypeConstants } from "../../constants/common";
import { FieldType } from "../../types/general";
import { useActionSheet } from "@expo/react-native-action-sheet";

type Navigation = ProfileStackNavigation<"Claim">;

type PhoneType = {
  countryCode: string;
  number: string;
};

type FormState = {
  [key: string]: string | PhoneType;
  mobileNumber: PhoneType;
};

const keyboardTypeMap: { [key: string]: KeyboardTypeOptions | undefined } = {
  house: "numbers-and-punctuation",
  email: "email-address",
  number: "number-pad",
  text: undefined
};

const ClaimScreen: React.FC = () => {
  const route = useRoute<ProfileStackNavigationRoute<"Claim">>();
  const api = useApi();
  const claim = getClaimFromType(route.params.claimType);
  const { showActionSheetWithOptions } = useActionSheet();
  const { addClaim, usersClaims } = useClaimsStore();
  const [disableButton, setDisableButton] = React.useState(false);
  const userClaim = usersClaims.find((c) => c.type === claim.type);
  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );
  const emailClaimValue = useClaimValue(ClaimTypeConstants.EmailCredential);
  const nameClaimValue = useClaimValue(ClaimTypeConstants.NameCredential);

  const navigation = useNavigation<Navigation>();
  const dateRefs = React.useRef<{ [key: string]: any }>({});
  const [showDatePickerForFieldId, setShowDatePickerForFieldId] =
    React.useState<string>();
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);
  const [rawDate, setRawDate] = React.useState<Date>();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showOtpDialog, setShowOtpDialog] = React.useState<boolean>(false);
  const [otpContext, setOtpContext] = React.useState<RequestOptResponse>();

  const {
    saveAndCheckBirthday,
    onSelectFile,
    loading,
    selectedFileIds,
    setLoading,
    setSelectedFileIds
  } = useClaimScreen();

  const showDatePickerFor = (fieldId: string) => {
    Keyboard.dismiss();
    dateRefs.current[fieldId].blur();
    setShowDatePickerForFieldId(fieldId);
  };

  const hideDatePicker = () => {
    setShowDatePickerForFieldId(undefined);
    Keyboard.dismiss();
  };

  const onDateSelect = (date: Date | undefined) => {
    if (showDatePickerForFieldId) {
      hideDatePicker();
      setRawDate(date);
      setFormState((previous) => ({
        ...previous,
        [showDatePickerForFieldId]: moment(date).format("DD/MM/YYYY")
      }));
    }
  };

  const onSave = async () => {
    setLoading(true);
    let newFormState = formState;
    if (claim.type === "EmailCredential") {
      newFormState = {
        ...newFormState,
        email: (newFormState.email as string).toLowerCase()
      };
    }
    await addClaim(claim.type, newFormState, selectedFileIds);
    const claims = await claimsLocalStorage.get();
    if (claim.type === "BirthCredential") saveAndCheckBirthday(claims);
    navigation.reset({
      routes: [{ name: "Home" }]
    });
    setLoading(false);
  };

  const canSave =
    claim.fields.filter((field) => formState[field.id]).length ===
      claim.fields.length &&
    ((isVerifying && selectedFileIds.length > 0) || !isVerifying);

  React.useEffect(() => {
    if (userClaim?.type === "EmailCredential" && userClaim.verified) {
      setDisableButton(true);
      setEmailInput(false);
    }
  }, [userClaim]);

  const isDocumentUploadVerifyAction =
    claim.verificationAction === "document-upload";

  const isOtpVerifyAction = claim.verificationAction === "otp";
  const shouldDisabledGeneratePgpKey = !emailClaimValue || !nameClaimValue;

  const formatMobileNumberState = () => {
    const mobileState = formState["mobileNumber"];
    const newMobileState = {
      countryCode: mobileState.countryCode.trim() ?? "+61",
      number: mobileState.number.replace(/^0/, "")
    };
    setFormState((previous) => ({
      ...previous,
      ["mobileNumber"]: newMobileState
    }));
    return newMobileState;
  };
  const openVerifyOtpScreen = async () => {
    setLoading(true);

    const newMobileState = formatMobileNumberState();
    if (newMobileState.countryCode !== "+61") {
      Alert.alert(
        "Error",
        "IDEM only supports Australian numbers for mobile claims/verification"
      );
      setLoading(false);
      return;
    }

    try {
      const otpResponse = await api.requestOtp({
        mobileNumber: `${newMobileState.countryCode}${newMobileState.number}`
      });
      if (otpResponse.hash && otpResponse.expiryTimestamp) {
        setOtpContext(otpResponse);
        setShowOtpDialog(true);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
    setLoading(false);
  };

    const emailClaim = usersClaims.find(
      (c) => c.type === ClaimTypeConstants.EmailCredential
    );


  const importPrivateKeyFileFromDevice = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["*/*"]
    });
    if (res.type === "cancel") return;
    const isCorrectFileType =
      res.name.endsWith(".asc") || res.name.endsWith(".key");
    if (!isCorrectFileType) {
      throw new Error("Invalid file type : expecting .asc or .key");
    }
    const fileContent = await FileSystem.readAsStringAsync(res.uri);
    return fileContent;
  };

  const importMyPrivateKeyFromTextInput = React.useCallback(
    async (content: string) => {
      try {
        await extractAndLoadKeyPairFromContent(content);
      } catch (error: any) {
        Alert.alert(
          AlertTitle.Error,
          `Failed to parse the Private Key \n> ${
            error?.message ?? "unknown error"
          }`
        );
      }
    },
    [extractAndLoadKeyPairFromContent]
  );

  const importPrivateKeyFromDevice = React.useCallback(async () => {
    try {
      const content = await importPrivateKeyFileFromDevice();
      if (!content) return;
      await extractAndLoadKeyPairFromContent(content);
    } catch (error: any) {
      Alert.alert(
        AlertTitle.Error,
        `Failed to extract the Private Key from file \n> ${
          error?.message ?? "unknown error"
        }`
      );
      console.error(error);
    }
  }, [extractAndLoadKeyPairFromContent]);

  const handleSubmitOtp = React.useCallback(
    async (otpCode: string | undefined) => {
      if (!otpCode || !otpContext) return;
      const { hash, expiryTimestamp } = otpContext;
      const { countryCode, number } = formState["mobileNumber"];

      try {
        const verifyOtp = await api.verifyOtp({
          hash,
          code: otpCode,
          expiryTimestamp,
          mobileNumber: `${countryCode}${number}`
        });

        if (verifyOtp) {
          addClaim(claim.type, formState, selectedFileIds, true);
          Alert.alert("Your mobile has been verified");
          navigation.reset({
            routes: [{ name: "Home" }]
          });
        } else {
          Alert.alert("Please try again, verification code invalid");
        }
      } catch (error: any) {
        Alert.alert(AlertTitle.Error, error?.message);
      }
    },
    [otpContext, api, addClaim, navigation]
  );

  return (
    <View style={commonStyles.screen}>
      <OtpDialog
        showDialog={showOtpDialog}
        onCancel={() => setShowOtpDialog(false)}
        onSubmit={(otpCode) => {
          handleSubmitOtp(otpCode).then(() => {
            setShowOtpDialog(false);
          });
        }}
      />
      <ScrollView style={commonStyles.screenContent}>
        <View>
          <StatusBar hidden={false} />
          {claim.fields.map((field) => {
            const onChange = (value: string | PhoneType) => {
              setFormState((previous) => ({
                ...previous,
                [field.id]: value
              }));
            };
            if (["text", "number", "email", "house"].includes(field.type)) {
              const possibleType = field.type as Extract<
                FieldType,
                "text" | "number" | "email" | "house"
              >; // array.includes doesn't discriminate field.type for us :(
              return (
                <View key={field.id}>
                  <View style={styles.inputRow}>
                    <Input
                      label={field.title}
                      clearButtonMode="always"
                      keyboardType={keyboardTypeMap[possibleType]}
                      autoCapitalize="none"
                      value={formState[field.id] as string}
                      onChangeText={onChange}
                    />
                    <View>
                      <View style={styles.centeredView}>
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={modalVisible}
                        >
                          <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                              <Text>What is a PGP key?</Text>
                              <Text style={styles.PGPText}>
                                Pretty Good Privacy (PGP) is an encryption
                                program that provides cryptographic privacy and
                                authentication for data communication. PGP is
                                used for singing, encryption, and decrypting
                                texts, e-mails, files, directories, and whole
                                disk partitions and to increase the security of
                                e-mail communications.
                              </Text>
                              <Text style={styles.PGPText}>
                                IDEM uses PGP encryption to secure your
                                communication and data.
                              </Text>
                              <Text style={styles.PGPText}>
                                NOTE: Importing your keys saves them to your
                                local storage. IDEM does not have access to the
                                keys you import.
                              </Text>
                              <Pressable
                                onPress={() => setModalVisible(!modalVisible)}
                              >
                                <View style={styles.buttonWrapper}>
                                  <Text style={styles.textcolor}>Close</Text>
                                </View>
                              </Pressable>
                            </View>
                          </View>
                        </Modal>
                        <Pressable
                          style={styles.modalButton}
                          onPress={() => setModalVisible(true)}
                        >
                          <FontAwesome5
                            name="info-circle"
                            size={30}
                            solid
                            style={{ color: "#2089dc" }}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                  <StatusBar hidden={false} />
                  <View>
                    <Button
                      style={styles.button}
                      disabled={shouldDisabledGeneratePgpKey}
                      // {!keyText || isKeyTextIsPublicKey}
                      // || keyText !== undefined}
                      // {emailClaim?.verified}
                      onPress={() =>
                        showActionSheetWithOptions(
                          {
                            options: [
                              "Import Private Key",
                              "Import Private Key from Device",
                              "Generate new PGP Key and publish",
                              "cancel"
                            ],
                            cancelButtonIndex: 3
                          },
                          async (buttonIndex) => {
                            if (buttonIndex === 0) {
                              importMyPrivateKeyFromTextInput(
                                keyText as string
                              );
                            }
                            if (buttonIndex === 1) {
                              await importPrivateKeyFromDevice();
                            }
                            if (buttonIndex === 2) {
                              await generateAndPublishNewPgpKey(
                                nameClaimValue as string,
                                emailClaimValue as string
                              );
                            }
                          }
                        )
                      }
                    >
                      Setup PGP Key
                    </Button>
                    <Button
                      style={styles.button}
                      disabled={emailClaim?.verified}
                      onPress={() => verifyPublicKey(emailClaimValue)}
                    >
                      Verify
                    </Button>
                    <Text style={styles.PGPText}>FingerPrint:</Text>
                  </View>
                  <Input
                    label={field.title}
                    clearButtonMode="always"
                    keyboardType={keyboardTypeMap[possibleType]}
                    autoCapitalize="none"
                    value={formState[field.id] as string}
                    onChangeText={onChange}
                    editable={emailInput}
                  />
                </View>
              );
            }

            if (field.type === "date") {
              return (
                <Input
                  value={formState[field.id] as string}
                  key={field.id}
                  label={field.title}
                  ref={(ref) =>
                    (dateRefs.current = {
                      [field.id]: ref
                    })
                  }
                  onFocus={() => showDatePickerFor(field.id)}
                />
              );
            }

            if (field.type === "phone") {
              const phone = (formState[field.id] as PhoneType) ?? {};
              return (
                <View key={field.id}>
                  <Input
                    label="Country code"
                    keyboardType="phone-pad"
                    value={phone.countryCode}
                    defaultValue={"+61"}
                    onChangeText={(value) => {
                      onChange({ ...phone, countryCode: value });
                    }}
                    editable={false}
                  />

                  <Input
                    label={field.title}
                    keyboardType="phone-pad"
                    value={phone.number}
                    onChangeText={(value) => {
                      onChange({
                        countryCode: phone.countryCode ?? "+61",
                        number: value
                      });
                    }}
                  />
                </View>
              );
            }

            if (field.type === "boolean") {
              return (
                <View key={field.id} style={{ paddingVertical: 20 }}>
                  <Text style={{ marginBottom: 20 }}>{field.title}</Text>
                  <Switch
                    value={formState[field.id] === "true"}
                    onValueChange={(value) => {
                      onChange(value ? "true" : "false");
                    }}
                  />
                </View>
              );
            }
          })}
          {showDatePickerForFieldId && (
            <DateTimePicker
              onChange={(_event, date) => onDateSelect(date)}
              value={rawDate ?? new Date()}
            />
          )}
          {isDocumentUploadVerifyAction && (
            <VerificationFiles
              claim={claim}
              isVerifying={isVerifying}
              setIsVerifying={(newValue) => {
                setIsVerifying(newValue);
                setSelectedFileIds([]);
              }}
              selectedFileIds={selectedFileIds}
              onSelectFile={onSelectFile}
            />
          )}
        </View>
        <BottomNavBarSpacer />
      </ScrollView>
      <View style={styles.buttonWrapper}>
        {isOtpVerifyAction ? (
          <Button
            title="Verify"
            disabled={userClaim?.verified}
            onPress={() => {
              openVerifyOtpScreen();
            }}
            loading={loading}
          />
        ) : (
          <Button
            title={isVerifying ? "Save & Verify" : "Save"}
            disabled={!canSave || disableButton}
            onPress={onSave}
            loading={loading}
          />
        )}
      </View>
    </View>
  );
};

export default ClaimScreen;

const styles = StyleSheet.create({
  introText: {
    marginBottom: 10
  },
  inputRow: {},
  buttonWrapper: {
    margin: 10,
    backgroundColor: "#2089dc",
    padding: 5
  },
  textcolor: {
    color: "white"
  },
  headingText: {
    fontWeight: "500" as any,
    fontSize: 18,
    textAlign: "center"
  },
  button: {
    alignSelf: "stretch",
    marginHorizontal: 10,
    marginBottom: 10
  },
  datePicker: {
    height: 500
  },
  PGPText: {
    alignSelf: "stretch",
    marginTop: 10,
    marginBottom: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalButton: {
    borderRadius: 80,
    paddingHorizontal: 10,
    paddingVertical: 2
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    padding: 10
  }
});

const VerificationFiles: React.FC<{
  claim: Claim;
  isVerifying: boolean;
  selectedFileIds: string[];
  setIsVerifying: (value: boolean) => void;
  onSelectFile: (fileId: string) => void;
}> = ({
  claim,
  isVerifying,
  selectedFileIds,
  onSelectFile,
  setIsVerifying
}) => {
  const { files } = useDocumentStore();

  const filesThatCanBeUsedToVerify = files.filter((file) =>
    claim.verificationDocuments.includes(file.documentType)
  );

  const filesWithSelected = filesThatCanBeUsedToVerify.map((file) => ({
    ...file,
    selected: selectedFileIds.includes(file.id)
  }));

  const validDocumentNames = claim.verificationDocuments.map((document) => {
    return `- ${getDocumentFromDocumentType(document).title}`;
  });

  React.useLayoutEffect(() => {
    if (isVerifying && filesThatCanBeUsedToVerify.length === 0) {
      setIsVerifying(false);
      Alert.alert(
        "No valid documents",
        `Please add one of the following: \n${validDocumentNames.join("\n")}`,
        [
          {
            text: "OK",
            style: "destructive"
          }
        ],
        {
          cancelable: true
        }
      );
    }
  }, [isVerifying]);

  return (
    <View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Switch
          style={{ marginRight: 20 }}
          value={isVerifying}
          onValueChange={setIsVerifying}
        />
        <Text>Attach a document to this claim</Text>
      </View>
      {isVerifying ? (
        <>
          <Text style={styles.introText}>
            The following documents can be used to verify your{" "}
            {claim.title.toLowerCase()} claim:
          </Text>
          <FileList
            files={filesWithSelected}
            onFilePress={onSelectFile}
            isCheckList={true}
          />
          <BottomNavBarSpacer />
        </>
      ) : null}
    </View>
  );
};

const OtpDialog: React.FC<{
  showDialog: boolean;
  onCancel: () => void;
  onSubmit: (otpCode?: string) => void;
}> = ({ showDialog, onCancel, onSubmit }) => {
  const [otpCode, setOtpCode] = React.useState<string>();

  return (
    <Dialog.Container visible={showDialog} onBackdropPress={onCancel}>
      <Dialog.Title>Enter your verification code</Dialog.Title>
      <Dialog.Input
        onChangeText={setOtpCode}
        autoFocus={true}
        keyboardType={"number-pad"}
      ></Dialog.Input>
      <Dialog.Button
        onPress={onCancel}
        label="Cancel"
        bold={true}
        color="#007ff9"
      />
      <Dialog.Button
        onPress={() => {
          onSubmit(otpCode);
        }}
        label="OK"
        color="#007ff9"
      />
    </Dialog.Container>
  );
};
