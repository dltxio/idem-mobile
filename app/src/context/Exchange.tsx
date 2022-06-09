/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { exchangeLocalStorage } from "../utils/local-storage";
import { Alert } from "react-native";
import axios from "axios";
import * as password from "secure-random-password";

export type ExchangeValue = {
  makeGpibUser: (
    name: string | undefined,
    email: string | undefined
  ) => Promise<void>;
  gpibUserID: string | undefined;
  reset: () => void;
};

export const ExchangeContext = React.createContext<ExchangeValue | undefined>(
  undefined
);

export const ExchangeProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [gpibUserID, setGpibUserID] = React.useState<string | undefined>();

  React.useEffect(() => {
    (async () => {
      const initialGpibUserID = await exchangeLocalStorage.get();

      if (initialGpibUserID) {
        setGpibUserID(initialGpibUserID.gpibUserID);
      }
    })();
  }, []);

  const shareDetailsAlert = () => {
    Alert.alert(
      "Share Details",
      `Sign up successful, your temporary password is ` + randomTempPassword,
      [
        {
          text: "OK",
          onPress: () => console.log(""),
          style: "destructive"
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      {
        cancelable: true
      }
    );
  };

  const randomTempPassword = password.randomPassword({
    length: 10,
    characters: [password.lower, password.upper, password.digits]
  });

  const makeGpibUser = async (
    name: string | undefined,
    email: string | undefined
  ) => {
    if (name && email) {
      const body = JSON.stringify({
        fullName: name,
        email: email,
        password: randomTempPassword,
        referralCode: "",
        trackAddress: true,
        CreateAddress: true
      });

      try {
        const response = await axios.post(
          "https://testapi.getpaidinbitcoin.com.au/user",
          body,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        if (response.status === 200) {
          const userID = response.data;
          await exchangeLocalStorage.save(userID);
          shareDetailsAlert();
        }
      } catch (error: any) {
        console.log(error.response.data);
        Alert.alert(error.response.data);
      }
    }
  };

  const reset = () => {
    exchangeLocalStorage.clear();
    setGpibUserID("");
  };

  const value = React.useMemo(
    () => ({
      makeGpibUser,
      gpibUserID,
      reset
    }),
    [makeGpibUser, gpibUserID, reset]
  );

  return (
    <ExchangeContext.Provider value={value}>
      {props.children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = () => {
  const context = React.useContext(ExchangeContext);

  if (context === undefined) {
    throw new Error("uh oh error time");
  }

  return context;
};
