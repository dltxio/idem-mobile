import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClaimData } from "../types/claim";
import { File } from "../types/document";
import { Exchange } from "../types/exchange";
import { IdemVerification } from "../types/user";
import { PGP, Wallet } from "../types/wallet";

type LocalStorage<T> = {
  save: (data: T) => Promise<void>;
  get: () => Promise<T | null>;
  clear: () => Promise<void>;
};

const createLocalStorage = <T>(
  key: string,
  isObject: boolean
): LocalStorage<T> => {
  const save = (data: T) =>
    AsyncStorage.setItem(
      key,
      isObject ? JSON.stringify(data) : (data as unknown as string)
    );
  const get = async () => {
    const data = await AsyncStorage.getItem(key);

    if (!data) {
      return null;
    }

    return isObject ? JSON.parse(data) : data;
  };
  const clear = () => AsyncStorage.removeItem(key);

  return {
    save,
    get,
    clear
  };
};

export const claimsLocalStorage = createLocalStorage<ClaimData[]>(
  "CLAIMS",
  true
);

export const fileLocalStorage = createLocalStorage<File[]>("FILES", true);

export const mnemonicLocalStorage = createLocalStorage<Wallet>(
  "MNEMONIC",
  true
);

export const exchangeLocalStorage = createLocalStorage<Exchange>(
  "EXCHANGE",
  true
);

export const pgpLocalStorage = createLocalStorage<PGP>("PGP", true);

export const verificationStorage = createLocalStorage<IdemVerification>(
  "IDEM_VERIFICATION",
  true
);
