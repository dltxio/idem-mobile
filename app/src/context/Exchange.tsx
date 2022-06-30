/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { exchangeLocalStorage } from "../utils/local-storage";
import { Alert } from "react-native";
import axios from "axios";
import { IExchange } from "../interfaces/exchange-interface";
import { VerifyUserRequestBody } from "../types/exchange";
import { findNames } from "../utils/formatters";
import { createRandomPassword } from "../utils/randomPassword-utils";
import useApi from "../hooks/useApi";
import { VenderEnum } from "../types/user";

export type ExchangeValue = {
  signupGPIB: IExchange;
  signupCoinstash: IExchange;
  gpibUserID: string | undefined;
  reset: () => void;
  verifyOnExchange: (body: VerifyUserRequestBody) => Promise<void>;
};

export const ExchangeContext = React.createContext<ExchangeValue | undefined>(
  undefined
);

export const ExchangeProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [gpibUserID, setGpibUserID] = React.useState<string | undefined>();
  const api = useApi();

  React.useEffect(() => {
    (async () => {
      const initialGpibUserID = await exchangeLocalStorage.get();

      if (initialGpibUserID) {
        setGpibUserID(initialGpibUserID.gpibUserID);
      }
    })();
  }, []);

  const shareDetailsAlert = (randomTempPassword: string) => {
    Alert.alert(
      "Register",
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

  const signupGPIB: IExchange = {
    signUp: async (name: string, email: string) => {
      const randomTempPassword = createRandomPassword();
      const splitName = findNames(name);
      if (splitName?.firstName && splitName.lastName && randomTempPassword) {
        api
          .gpibSignup({
            source: VenderEnum.GPIB,
            firstName: splitName?.firstName,
            lastName: splitName?.lastName,
            email: email,
            password: randomTempPassword
          })
          .then(async (userId) => {
            await exchangeLocalStorage.save({ gpibUserID: userId });
            Alert.alert(
              `Sign up successful, your temporary password is ${randomTempPassword}`
            );
          })
          .catch((error) => {
            Alert.alert(error.message);
          });
      }
    }
  };

  const signupCoinstash: IExchange = {
    signUp: async (name: string, email: string) => {
      const randomTempPassword = createRandomPassword();
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

        shareDetailsAlert(randomTempPassword);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.log("axios error response :", error.response.data);
          } else if (error.request) {
            console.log("axios error request :", error.request);
          } else {
            console.log("axios other error :", error.message);
          }
        } else {
          console.log("unknown error :", error);
        }

        Alert.alert(
          "Unable to register with the provided credential",
          "The email might already be in use"
        );
      }
    }
  };

  const verifyOnExchange = async (body: VerifyUserRequestBody) => {
    const auth = JSON.stringify({
      userName: body.userName,
      password: body.password
    });
    try {
      const checkUserAuth = await axios.post(
        "https://testapi.getpaidinbitcoin.com.au/user/authenticate",
        auth,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (checkUserAuth.status === 200) {
        const jwt = checkUserAuth.data.token;
        const userInfo = {
          firstName: body.firstName,
          lastName: body.lastName,
          yob: Number(body.yob)
        };
        const updatedUserInfo = await axios.put(
          `https://testapi.getpaidinbitcoin.com.au/AccountInfoes`,
          userInfo,
          {
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          }
        );
        if (updatedUserInfo.status === 200) {
          Alert.alert(
            "Success!",
            `Details updated: first name, last name, date of birth`
          );
        }
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data === "Username or password is incorrect") {
        Alert.alert("Password is incorrect");
      } else {
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
      signupGPIB,
      gpibUserID,
      reset,
      signupCoinstash,
      verifyOnExchange
    }),
    [signupGPIB, gpibUserID, signupCoinstash, verifyOnExchange, reset]
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
