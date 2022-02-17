import React, { useState } from "react";
import isEmail from "validator/lib/isEmail";
import { Text, View, TextInput, ViewStyle } from "react-native";
import styles from "../../styles";
import { observer } from "mobx-react-lite";
import Button from "../../components/Button";
import {
  sendEmailVerificationEmail,
  verifyEmailCode,
} from "../../helpers/claim/email";
import useClaims from "../../hooks/useClaims";

const EmailClaim = ({ item }: { item: server.Claim }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [code, setCode] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [isVerifySuccess, setIsVerifySuccess] = useState<boolean>(false);

  const { setClaim } = useClaims();
  const emailCredentialValue = item.credentialSubject.value;
  
  const onVerify = async () => {
    if (!value) {
      setError("Email can not be empty");
      return;
    }
    if (!code) {
      setError("Code can not be empty");
      return;
    }
    try {
      await verifyEmailCode({ email: value, code: code });
    } catch (e) {
      console.log(e);
      const error = e as server.ErrorResponse;
      if (error.reason === "bad_request") {
        // do something
      }

      if (error.reason === "not_found") {
        // do something different
      }
      return;
    }
    setIsVerifySuccess(true);
  };

  const onVerifyPress = async () => {
    if (!value) {
      // this should never happen because button should be disabled
      return;
    }
    setLoading(true);

    if (code) {
      onVerify();
    } else {
      try {
        await sendEmailVerificationEmail({ email: value });
      } catch (e) {
        console.log(e);
        const error = e as server.ErrorResponse;
        if (error.reason === "bad_request") {
          // do something
        }

        if (error.reason === "not_found") {
          // do something different
        }
      }
      setIsEmailSent(true);
    }

    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{
          ...styles.claim.input,
          width: styles.layout.window.width,
        }}
        value={email !== undefined ? email : (value as undefined | string)}
        keyboardType="email-address"
        placeholder="Please enter your email address..."
        onChangeText={(value) => {
          setEmail(value);
        }}
        onBlur={async () => {
          if (!!email && isEmail(email)) {
            setError("");
            try {
              setClaim(item.key, email);
            } catch (error: any) {
              setError(error);
            }
          } else {
            setError("Please enter a valid email");
          }
        }}
      />
      {!!error && <Text style={styles.claim.errorMessage}>{error}</Text>}
      {isEmailSent && (
        <TextInput
          style={{
            ...styles.claim.input,
            width: styles.layout.window.width,
          }}
          value={code !== undefined ? code : ""}
          placeholder="Please enter the code..."
          onChangeText={(value) => {
            setCode(value);
          }}
        />
      )}
      {!!isVerifySuccess && <Text>Verify success</Text>}
      <Button
        title="Verify"
        style={styles.claim.verifyButton as ViewStyle}
        disabled={!value}
        onPress={onVerifyPress}
      />
    </View>
  );
};

export default observer(EmailClaim);
