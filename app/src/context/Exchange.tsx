/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { exchangeLocalStorage } from "../utils/local-storage";
import { Alert } from "react-native";
import axios from "axios";
import { IExchange, stuff } from "../interfaces/exchange-interface";
import { VerifyUserRequestBody } from "../types/exchange";
import { findNames } from "../utils/formatters";
import { createRandomPassword } from "../utils/randomPassword-utils";
import { signUpUserRequestBody } from "../types/exchange";

export type ExchangeValue = {
  makeGpibUser: IExchange;
  makeCoinstashUser: IExchange;
  makeEasyCryptoUser: IExchange;
  gpibUserID: string | undefined;
  reset: () => void;
  verifyOnGpib: (body: VerifyUserRequestBody) => Promise<void>;
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
  // MAKE GPIB USER
  const makeGpibUser: IExchange = {
    signUp: async (name: string, email: string) => {
      const randomTempPassword = createRandomPassword();
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
          await exchangeLocalStorage.save({ gpibUserID: userID });
          shareDetailsAlert(randomTempPassword);
        }
      } catch (error: any) {
        console.log(error.response.data);
        Alert.alert(error.response.data);
      }
    }
  };

  // MAKE EASY CRPYTO USER
 const makeEasyCryptoUser: IExchange = {
    signUp: async (email: string) => {
      const randomTempPassword = createRandomPassword();
      const bodyEasyCrypto = JSON.stringify({
        email: email, 
        password: randomTempPassword,
        returnSecureToken: true
      });
      try {
        const checkUserAuthEasyCrypto = await axios.post(
          "https://api.easycrypto.com.au/api/user.php",
          bodyEasyCrypto,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        const nameStuff = async (bod: stuff) => {
        if (checkUserAuthEasyCrypto.status === 200) {
          const jwtEasy = checkUserAuthEasyCrypto.data.token;
          const updatedEasyBody = {
            firstName: bod.firstName,
            lastName: bod.lastName,
            yob: Number(bod.yob),
            mobile: bod.mobile,
            extraIdNumber: null,
            action: "checkExisting",
            version: 2,
            siteVersion: "8.16.3"
          };
          const updateUserInfo = await axios.post(
            `https://api.easycrypto.com.au/apiv2/verify.php`,
            updatedEasyBody,
            {
              headers: {
                Authorization: `Bearer ${jwtEasy}`
              }
            }
          );
          if (updateUserInfo.status === 200) {
            Alert.alert(
              "Success!",
              `You have signed up to Easy Crypto successfully. Your temporary password is ${randomTempPassword}`
            );
          }
        }
      } catch (error: any) {
        console.log(error);
        Alert.alert(error.response.data);
      }
    };
  };

  // MAKE COINSTASH USER
  const makeCoinstashUser: IExchange = {
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
        console.log(error.response.data);
        Alert.alert(error.response.data);
      }
    }
  };

  //VARIFY GPIB USER
  const verifyOnGpib = async (body: VerifyUserRequestBody) => {
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
      makeGpibUser,
      gpibUserID,
      reset,
      makeCoinstashUser,
      makeEasyCryptoUser,
      verifyOnGpib
    }),
    [
      makeGpibUser,
      gpibUserID,
      makeCoinstashUser,
      verifyOnGpib,
      makeEasyCryptoUser,
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
