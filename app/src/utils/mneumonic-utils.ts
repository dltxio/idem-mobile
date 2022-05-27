import React from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ProfileStackParamList } from "../navigation/ProfileStackNavigator";

const [mnemonic, setMnemonic] = React.useState<string | undefined>();
const navigator = useNavigation() as NavigationProp<ProfileStackParamList>;

export const createMneumonic = async () => {
  try {
    const wallet = ethers.Wallet.createRandom();
    await AsyncStorage.setItem("PRIVATE_KEY", wallet.privateKey);
    setMnemonic(wallet.mnemonic.phrase);
    return mnemonic;
  } catch (error) {
    console.log(error);
  }
};

export const getMneumonic = async () => {
    try {
      const mneumonic = await AsyncStorage.getItem("PRIVATE_KEY");
      if (!mneumonic) {
        createMneumonic()
      }
      navigator.navigate("Home")
    } catch(e) {
      throw new Error("Cannot fetch data")
    }
  }