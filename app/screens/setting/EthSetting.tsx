import React, { useState } from "react";
import { View, Text, ViewStyle, TextInput } from "react-native";
import styles from "../../styles";
import Button from "../../components/Button";
import { GetEthKeypair } from "../../helpers/setting/EthKeypair";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ethers } from "ethers";
import * as Random from "expo-random";

const EthSetting = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [mnemonicKey, setMnemonicKey] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const onGetKeypairPress = async () => {
    if (mnemonicKey) {
      try {
        const response = await GetEthKeypair(mnemonicKey);
        if (response) {
          await AsyncStorage.setItem("eth-keypair", JSON.stringify(response));
          setMessage("Your keypair has been stored in your device");
        }
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      }
    } else {
      setError("Please enter a mnemonic key");
    }
  };

  const onCreateEthKeypairPress = async () => {
    try {
      const randomBytes = await await Random.getRandomBytesAsync(16);
      const mnemonic = ethers.utils.entropyToMnemonic(randomBytes);
      const response = await GetEthKeypair(mnemonic);
      if (response) {
        await AsyncStorage.setItem("eth-keypair", JSON.stringify(response));
        setMessage(
          `Your keypair has been stored in your device, here is your address : "${response.address}" and mnemonic: "${mnemonic}", please save it to revocery your account`,
        );
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{
          ...styles.claim.input,
          width: styles.layout.window.width,
        }}
        keyboardType="default"
        placeholder="Please enter your mnemonic key"
        onChangeText={(value) => {
          setMnemonicKey(value);
        }}
        onBlur={(value) => {
          if (!value) {
            setError("Please enter a mnemonic key");
          }
        }}
      />
      {!!error && <Text style={styles.claim.errorMessage}>{error}</Text>}
      {message && <Text>{message}</Text>}
      <Button
        title="Get ETH Keypair from Mnemonic"
        style={styles.claim.libraryUploadButton as ViewStyle}
        onPress={onGetKeypairPress}
      />
      <Button
        title="Create ETH keypair"
        style={styles.claim.verifyButton as ViewStyle}
        onPress={onCreateEthKeypairPress}
      />
    </View>
  );
};

export default EthSetting;
