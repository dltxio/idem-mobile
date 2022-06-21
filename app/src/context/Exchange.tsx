/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { exchangeLocalStorage } from "../utils/local-storage";
import { Alert } from "react-native";
import axios from "axios";
import * as password from "secure-random-password";
import { IExchange } from "../interfaces/exchange-interface";
import { VerifyUserRequestBody } from "../types/exchange";
import { findNames } from "../utils/formatters";

export type ExchangeValue = {
  makeGpibUser: IExchange;
  makeCoinstashUser: IExchange;
  gpibUserID: string | undefined;
  reset: () => void;
  verifyOnExchange: (body: VerifyUserRequestBody) => Promise<void>;
  randomTempPassword: string | undefined;
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
      await exchangeLocalStorage.clear();
      const initialGpibUserID = await exchangeLocalStorage.get();

      if (initialGpibUserID) {
        setGpibUserID(initialGpibUserID.gpibUserID);
      }
    })();
  }, []);

  const shareDetailsAlert = () => {
    Alert.alert(
      "Share Details",
      `Sign up successful, your temporary password is ${randomTempPassword}`,
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

  const makeGpibUser: IExchange = {
    signUp: async (name: string, email: string) => {
      const splitName = findNames(name);
      const body = JSON.stringify({
        firstName: splitName?.firstName,
        lastName: splitName?.lastName,
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

  const makeCoinstashUser: IExchange = {
    signUp: async (name: string, email: string) => {
      const body = JSON.stringify({
        email: email,
        password: randomTempPassword,
        acceptMarketing: true,
        displayName: name,
        country: "Australia",
        token:
          "03AGdBq27KVpnMB7gMZ5cFs1ldEgu1ojl7-8mE6_zjJC1xM3plgAfHcEPy6Pqa2HIqGmD2OBAUIC_9YWcgQTk-Gi0rKe-Xx9VTjcSUwxWXjxO5koYZSVrAw0zTUB7RPcEO1ZvudSyv4eu59iV-T-SpJNhsEMXuAYmzlvsUIBRmFJO1E3dVODRYeMoDtfV8f_MbcCYgqhfBJBQYll8df2D4BofGFelWpDF0KNdSFjdvGEhqZGF7hgy5qUJSjuxP6Ufs9f_8eYFiK1M8xeu6iO4OOIsksD0DdwKBQwa3JPLYOEwPerUwEVBcweuutJ82hpXEbtlMMBTzz2QDRbbQrPT6MEQ4Cj2scA2tS0jUpK_fYtkVUfzU7w4Y1upmAPL6XnPPRfSczdsBEaA1DtvchpkgFo2Zg5G1WoZrOkwnaxiSPw3RmDrHx1oLcfGWXBt8TkmfmjSI0-DFVgCN"
      });
      try {
        await axios.post("https://coinstash.com.au/api/auth/signup", body, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        shareDetailsAlert();
      } catch (error: any) {
        console.log(error.response.data);
        Alert.alert(error.response.data);
      }
    }
  };

  const verifyOnExchange = async (body: VerifyUserRequestBody) => {
    const checkAuthBody = JSON.stringify({
      userName: body.userName,
      password: body.password
    });
    try {
      const checkUserAuth = await axios.post(
        "https://testapi.getpaidinbitcoin.com.au/user/authenticate",
        checkAuthBody,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (checkUserAuth.status === 200) {
        const jwt = checkUserAuth.data.token;
        const updatedBody = {
          firstName: body.firstName,
          lastName: body.lastName,
          yob: Number(body.yob)
        };
        const updateUserInfo = await axios.put(
          `https://testapi.getpaidinbitcoin.com.au/AccountInfoes`,
          updatedBody,
          {
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          }
        );
        if (updateUserInfo.status === 200) {
          Alert.alert(
            "Success!",
            `Details updated: first name, last name, year of birth`
          );
        }
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert(error.response.data);
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
      reset,
      makeCoinstashUser,
      verifyOnExchange,
      randomTempPassword
    }),
    [
      makeGpibUser,
      gpibUserID,
      makeCoinstashUser,
      verifyOnExchange,
      randomTempPassword,
      reset
    ]
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
    throw new Error("useExchange must be used within a ExchangeProvider");
  }

  return context;
};
