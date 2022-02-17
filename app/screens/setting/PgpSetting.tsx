import React, { useState } from "react";
import { View, Text, ViewStyle, TextInput } from "react-native";
import styles from "../../styles";
import Button from "../../components/Button";
import { CreatePGPKeypair } from "../../helpers/setting/PgpKeypair";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PgpKeypair = {
  name: string;
  email: string;
  passphrase: string | undefined;
};

const PgpSetting = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [passphrase, setPasshrase] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const onGetPGPKeypairPress = async () => {
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!email) {
      setError("Please enter you email address");
      return;
    }
    try {
      const pgpRequest: PgpKeypair = {
        name: name,
        email: email,
        passphrase: passphrase,
      };
      const response = await CreatePGPKeypair(pgpRequest);
      if (response) {
        await AsyncStorage.setItem("pgp-keypair", JSON.stringify(response));
        setMessage("Your PGP keypair has been stored in your device");
      }
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{
          ...styles.claim.input,
          width: styles.layout.window.width,
          marginTop: 10,
        }}
        keyboardType="default"
        placeholder="Please enter your name"
        onChangeText={(value) => {
          setName(value);
        }}
        onBlur={(value) => {
          if (!value) {
            setError("Please enter your name");
          }
        }}
      />
      <TextInput
        style={{
          ...styles.claim.input,
          width: styles.layout.window.width,
          marginTop: 10,
        }}
        keyboardType="default"
        placeholder="Please enter your email address"
        onChangeText={(value) => {
          setEmail(value);
        }}
        onBlur={(value) => {
          if (!value) {
            setError("Please enter your email address ");
          }
        }}
      />
      <TextInput
        style={{
          ...styles.claim.input,
          width: styles.layout.window.width,
          marginTop: 10,
        }}
        keyboardType="default"
        placeholder="Please enter your mnemonic seed phrase"
        onChangeText={(value) => {
          setPasshrase(value);
        }}
      />
      {!!error && <Text style={styles.claim.errorMessage}>{error}</Text>}
      {message && <Text>{message}</Text>}
      <Button
        title="Create PGP Keypair"
        style={styles.claim.verifyButton as ViewStyle}
        onPress={onGetPGPKeypairPress}
      />
    </View>
  );
};

export default PgpSetting;
