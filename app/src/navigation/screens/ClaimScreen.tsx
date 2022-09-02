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
  Dimensions,
  KeyboardTypeOptions,
  StatusBar
} from "react-native";
import Dialog from "react-native-dialog";
import { Input, Switch } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import commonStyles from "../../styles/styles";
import {
  ProfileStackNavigation,
  ProfileStackNavigationRoute
} from "../../types/navigation";
import { getClaimFromType } from "../../utils/claim-utils";
import { Claim, RequestOptResponse } from "../../types/claim";
import { FileList, Button } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useDocumentStore } from "../../context/DocumentStore";
import { getDocumentFromDocumentType } from "../../utils/document-utils";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import useClaimScreen from "../../hooks/useClaimScreen";
import { claimsLocalStorage } from "../../utils/local-storage";
import useApi from "../../hooks/useApi";
import { AlertTitle } from "../../constants/common";
import { FieldType } from "../../types/general";

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

  const { addClaim, usersClaims } = useClaimsStore();
  const [disableButton, setDisableButton] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState(true);
  const userClaim = usersClaims.find((c) => c.type === claim.type);
  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );

  const navigation = useNavigation<Navigation>();
  const dateRefs = React.useRef<{ [key: string]: any }>({});
  const [showDatePickerForFieldId, setShowDatePickerForFieldId] =
    React.useState<string>();
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);
  const [rawDate, setRawDate] = React.useState<Date>();
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
                    placeholder="+61"
                    value={phone.countryCode}
                    defaultValue={"+61"}
                    onChangeText={(value) => {
                      onChange({ ...phone, countryCode: value });
                    }}
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
  buttonWrapper: {
    bottom: 0,
    width: Dimensions.get("window").width - 40,
    margin: 20
  },
  datePicker: {
    height: 500
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
