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

// TODO: remove
import { claimsLocalStorage } from "../../utils/local-storage";
import useApi from "../../hooks/useApi";
import { AlertTitle } from "../../constants/common";
import { FieldType } from "../../types/general";
import PgpSection from "../../components/PgpSection";
import usePgp from "../../hooks/usePpg";
import isEmail from "validator/lib/isEmail";
import { Email } from "../../../claims/email";

type Navigation = ProfileStackNavigation<"Claim">;

// move to constants
const keyboardTypeMap: { [key: string]: KeyboardTypeOptions | undefined } = {
  house: "numbers-and-punctuation",
  email: "email-address",
  number: "number-pad",
  text: undefined
};

const EmailView: React.FC = () => {
  const route = useRoute<ProfileStackNavigationRoute<"Claim">>();
  const api = useApi();

  const claim = new Email<string>();

  const [email, setEmail] = React.useState("");

  // const { addClaim, usersClaims } = useClaimsStore();

  const [disableButton, setDisableButton] = React.useState(false);
  const [disabledEmailInput, setDisabledEmailInput] = React.useState(false);

  // const userClaim = usersClaims.find((c) => c.type === claim.type);

  //   const [formState, setFormState] = React.useState<FormState>(
  //     userClaim?.value ?? {}
  //   );

  // add claim to react state?

  const navigation = useNavigation<Navigation>();
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);

  const { verifyPublicKey } = usePgp();
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSave = async () => {
    setLoading(true);

    await claim.save(email);

    // todo: alert

    // await addClaim(claim.type, formState, selectedFileIds);
    // if (isEmailClaim) {
    //   if (!isEmail(formState.email as string)) {
    //     return Alert.alert(
    //       AlertTitle.Warning,
    //       "Please type a valid email claim value in the input field."
    //     );
    //   }
    //   setLoading(false);
    //   const email = (formState.email as string).toLowerCase();
    //   await verifyPublicKey(email);
    // }

    navigation.reset({
      routes: [{ name: "Home" }]
    });

    setLoading(false);
  };

  const canSave = () => {
    email.length > 0;
  };

  //   // this should be a front end thing
  //   const canSave =
  //     claim.fields.filter((field) => formState[field.id]).length ===
  //       claim.fields.length &&
  //     ((isVerifying && selectedFileIds.length > 0) || !isVerifying);

  //   const isEmailVerified =
  //     userClaim?.type === "EmailCredential" && userClaim.verified;
  //   React.useEffect(() => {
  //     if (isEmailVerified) {
  //       setDisableButton(true);
  //       setDisabledEmailInput(true);
  //     }
  //   }, [userClaim]);

  const isEmailVerified = claim.verify();

  //   const isDocumentUploadVerifyAction =
  //     claim.verificationAction === "document-upload";

  const showPgpFields = true; // claim.type === "EmailCredential";

  // const isOtpVerifyAction = claim.verificationAction === "otp";

  return (
    <View style={commonStyles.screen}>
      <ScrollView style={commonStyles.screenContent}>
        <View style={styles.content}>
          <StatusBar hidden={false} />

          <View key="email">
            <Input
              label="email"
              clearButtonMode="always"
              keyboardType={keyboardTypeMap["email"]}
              autoCapitalize="none"
              value={email}
              // onChangeText={onChange}
              disabled={disabledEmailInput}
            />
          </View>

          <PgpSection emailInput={email} isEmailVerified={isEmailVerified} />
          <Button
            title={isVerifying ? "Save & Verify" : "Save"}
            disabled={!canSave || disableButton}
            onPress={onSave}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EmailView;

const styles = StyleSheet.create({
  content: { marginBottom: 10 },
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
  },
  mobileWarningText: {
    marginHorizontal: 10,
    marginBottom: 20
  }
});
