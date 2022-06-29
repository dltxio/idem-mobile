import { useRoute } from "@react-navigation/native";
import * as React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  Linking,
  Alert
} from "react-native";
import { Button } from "../../components";
import useVendorsList from "../../hooks/useVendorsList";
import { VendorStackNavigationRoute } from "../../types/navigation";
import { useExchange } from "../../context/Exchange";
import { findNames, findYOB } from "../../utils/formatters";
import { ScrollView } from "react-native-gesture-handler";
import { VerifyOnProxy } from "../../types/general";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { IExchange } from "../../interfaces/exchange-interface";
import useVerifyClaims from "../../hooks/useVerifyClaims";
import { exchangeLocalStorage } from "../../utils/local-storage";
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import * as Crypto from "expo-crypto";
import usePushNotifications from "../../hooks/usePushNotifications";

const VendorDetailsScreen: React.FC = () => {
  const { usersClaims } = useClaimsStore();
  const { vendors } = useVendorsList();
  const { expoPushToken } = usePushNotifications();
  const { makeGpibUser, makeCoinstashUser, verifyOnExchange } = useExchange();
  const route = useRoute<VendorStackNavigationRoute<"VendorDetails">>();
  const name = useClaimValue("FullNameCredential");

  const addressValue = usersClaims.find(
    (claim) => claim.type === "AddressCredential"
  )?.value;

  const address = useClaimValue("AddressCredential");
  const email = useClaimValue("EmailCredential");
  const dob = useClaimValue("DateOfBirthCredential");
  const yob = findYOB(dob ? dob : "");
  const splitName = findNames(name);
  const { verifyClaims, postTokenToProxy } = useVerifyClaims();

  const vendor = vendors.find((v) => v.name === route.params.vendorId);
  const [signed, setSigned] = React.useState<boolean>(false);

  const hasAllRequiredClaims = React.useMemo(() => {
    if (!vendor || !vendor.requiredClaimMnemonics) {
      return true;
    }

    const userClaimMnemonicMap = usersClaims.reduce(
      (acc, claim) => {
        acc[claim.mnemonic] = true;
        return acc;
      },
      {} as {
        [key: string]: boolean;
      }
    );

    return vendor.requiredClaimMnemonics.every(
      (mnemonic) => userClaimMnemonicMap[mnemonic]
    );
  }, [usersClaims, vendor]);

  const verifyOnProxyRequestBody = async () => {
    if (vendor) {
      if (splitName && dob && address && email) {
        const hashEmail = async () => {
          return Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            email
          );
        };

        const userEmail = await hashEmail();
        const gpibUserID = await exchangeLocalStorage.get();
        const userClaims = {
          firstName: splitName.firstName,
          lastName: splitName.lastName,
          dob: dob,
          email: userEmail.toString(),
          houseNumber: addressValue.houseNumber,
          street: addressValue.street,
          suburb: addressValue.suburb,
          postcode: addressValue.postCode,
          state: addressValue.state,
          country: addressValue.country,
          userId: gpibUserID?.gpibUserID
        } as VerifyOnProxy;
        await verifyClaims(userClaims, vendor);
      }
      if (expoPushToken) {
        await postTokenToProxy(expoPushToken, vendor);
      }
    }
  };

  const idToIExchange: { [id: number]: IExchange } = {
    1: makeGpibUser,
    2: makeCoinstashUser
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: vendor?.backgroundColor }]}
      key={vendor?.name}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.header}>{vendor?.name}</Text>
      <Text style={styles.description}>{vendor?.description}</Text>
      <Image source={{ uri: vendor?.logo }} style={styles.logo} />
      <View style={styles.buttonWrapper}>
        {name && dob && address && email && (
          <View style={styles.buttonWrapper}>
            <Button
              title="Verify My Claims"
              disabled={signed ? false : true}
              onPress={async () => {
                verifyOnProxyRequestBody();
              }}
            />
          </View>
        )}
        <Button
          onPress={async () => {
            if (vendor) {
              const makeUser = idToIExchange[vendor.id];
              if (!makeUser) {
                Linking.openURL(vendor.signup);
                return;
              }
              if (name && email) {
                await makeUser.signUp(name, email);
                setSigned(true);
              } else {
                Alert.alert(
                  "Missing Credentials",
                  "Please provide your name and email claims to sign up"
                );
              }
            }
          }}
          title="Sign Up"
          disabled={signed || !hasAllRequiredClaims}
          style={styles.button}
        />
        {vendor?.website === "https://getpaidinbitcoin.com.au" ? (
          <Button
            onPress={() => {
              Alert.prompt("Enter your GPIB password", "", [
                {
                  text: "OK",
                  onPress: async (value: string | undefined) => {
                    await verifyOnExchange({
                      userName: email,
                      password: value,
                      firstName: splitName?.firstName,
                      lastName: splitName?.lastName,
                      yob
                    });
                  }
                }
              ]);
            }}
            title="Sync Details"
          />
        ) : (
          <Text></Text>
        )}
      </View>
      <BottomNavBarSpacer />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height
  },
  scrollContent: {
    justifyContent: "flex-start",
    alignItems: "center"
  },
  header: {
    fontSize: 30,
    marginTop: 10
  },
  description: {
    marginVertical: 20,
    width: Dimensions.get("window").width * 0.9
  },
  logo: {
    width: 170,
    height: 120
  },
  buttonWrapper: {
    width: Dimensions.get("window").width * 0.9,
    marginTop: Dimensions.get("window").height / 6,
    justifyContent: "space-around"
  },
  button: {
    marginVertical: 5
  }
});
export default VendorDetailsScreen;
