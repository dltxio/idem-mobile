import React, { useState } from "react";
import { Text, View, TextInput, ViewStyle, Alert } from "react-native";
import styles from "../../styles";
import Button from "../../components/Button";
import { observer } from "mobx-react-lite";
import Bodal from "../../components/Bodal";
import { sendMobileCode, verifyMobileCode } from "../../helpers/claim/mobile";
import useClaims from "../../hooks/useClaims";

const MobileClaim = ({ item }: { item: server.Claim }) => {
  const [mobile, setMobile] = useState(undefined as undefined | string);
  const [error, setError] = useState(undefined as undefined | string);
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { setClaim } = useClaims();
  
  const mobileCredentialValue = item.credentialSubject.value;

  const isMobile = (value: string) => {
    return (
      value.length < 13 &&
      !!value.replace(/\s*/g, "").match(/(\+[0-9]{2}|0|[0-9]{2})[0-9]{9}/)
    );
  };

  const verifyMobile = async () => {
    setSubmitting(true);
    try {
      verifyMobileCode({
        number: value,
        code,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitting(false);
    }
  };

  const sendCode = () => {
    setSubmitting(true);
    try {
      Alert.alert(
        "Send verification code?",
        `Would you like to send a verification code to ${value}?`,
        [
          {
            text: "Proceed",
            onPress: () => {
              sendMobileCode({
                number: value!,
              });
            },
          },
          { text: "Cancel", onPress: () => setModalOpen(false) },
        ],
      );
      // TODO: SuccessToast
    } catch (e) {
      console.log(e);
      // TODO: failure toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{
          ...styles.claim.input,
          width: styles.layout.window.width,
        }}
        value={
          mobile !== undefined ? mobile : (value as undefined | string)
        }
        placeholder="Please enter your mobile number..."
        keyboardType="phone-pad"
        onChangeText={(value) => {
          setMobile(value);
        }}
        onBlur={async () => {
          if (!!mobile && isMobile(mobile)) {
            setError("");
            try {
              setClaim(item.key, mobile);
            } catch (error: any) {
              setError(error);
            }
          } else {
            setError("Please enter a valid mobile number");
          }
        }}
      />
      {!!error && <Text style={styles.claim.errorMessage}>{error}</Text>}
      <Button
        title="Verify"
        style={styles.claim.verifyButton as ViewStyle}
        disabled={submitting}
        onPress={() => setModalOpen(true)}
      />
      <Bodal open={modalOpen} onClose={() => setModalOpen(false)}>
        <View style={{ width: "100%", minHeight: 200 }}>
          <Button
            title="Send verification code"
            onPress={() => !!value && isMobile(value) && sendCode()}
            disabled={submitting}
            style={styles.claim.button as ViewStyle}
          />
          <TextInput
            style={{
              ...styles.claim.input,
              width: "100%",
            }}
            onChangeText={(value) => setCode(value)}
            placeholder="Enter verification code..."
            value={code || undefined}
          />
          <Button
            disabled={submitting}
            title="Verify code"
            onPress={() =>
              !!value && isMobile(value) && !!code && verifyMobile()
            }
            style={styles.claim.button as ViewStyle}
          />
        </View>
      </Bodal>
    </View>
  );
};

export default observer(MobileClaim);
