import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { ClaimData } from "../types/claim";
import { File } from "../types/document";
import { Mnemonic } from "../types/wallet";

type LocalStorage<T> = {
  save: (data: T) => Promise<void>;
  get: () => Promise<T | null>;
  clear: () => Promise<void>;
};

const createLocalStorage = <T>(key: string): LocalStorage<T> => {
  const save = (data: T) => AsyncStorage.setItem(key, JSON.stringify(data));
  const get = async () => {
    const data = await AsyncStorage.getItem(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  };
  const clear = () => AsyncStorage.removeItem(key);

  return {
    save,
    get,
    clear
  };
};

const createSecureStorage = <T>(key: string): LocalStorage<T> => {
  const save = (data: T) => SecureStore.setItemAsync(key, JSON.stringify(data));
  const get = async () => {
    const data = await SecureStore.getItemAsync(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  };
  const clear = () => SecureStore.deleteItemAsync(key);

  return {
    save,
    get,
    clear
  };
};

export const claimsLocalStorage = createLocalStorage<ClaimData[]>("CLAIMS");
export const fileLocalStorage = createLocalStorage<File[]>("FILES");
export const hasMnemonicLocalStorage = createLocalStorage<boolean>("MNEMONIC");
export const mnemonicLocalStorage = createSecureStorage<Mnemonic>("MNEMONIC");
