import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { View, Image, StyleSheet, Text, Dimensions, Alert } from "react-native";
import { Button } from "../../components";
import useVendorsList from "../../hooks/useVendorsList";
import { VendorStackNavigationRoute } from "../../types/navigation";
import { findNames } from "../../utils/formatters";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import useVerifyClaims from "../../hooks/useVerifyClaims";
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import * as Crypto from "expo-crypto";
import usePushNotifications from "../../hooks/usePushNotifications";
import { UserVerifyRequest } from "../../types/user";
import useVendors from "../../hooks/userVendors";
import { getVendor } from "../../utils/vendor";
import { exchangeLocalStorage } from "../../utils/local-storage";

const VendorDetailsScreen: React.FC = () => {
  const { usersClaims } = useClaimsStore();
  const { vendors } = useVendorsList();
  const { expoPushToken } = usePushNotifications();
  const route = useRoute<VendorStackNavigationRoute<"VendorDetails">>();

  const name = useClaimValue("NameCredential");

  const addressValue = usersClaims.find(
    (claim) => claim.type === "AddressCredential"
  )?.value;

  const address = useClaimValue("AddressCredential");
  const email = useClaimValue("EmailCredential");
  const dob = useClaimValue("BirthCredential");
  const splitName = findNames(name);
  const { verifyClaims, postTokenToProxy } = useVerifyClaims();

  const vendor = vendors.find((v) => v.id == route.params.id);
  const [signed, setSigned] = React.useState<boolean>(false);
  const { signup, syncDetail } = useVendors();

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

  React.useEffect(() => {
    if (!hasAllRequiredClaims) {
      Alert.alert(
        "Missing required claims",
        `You must have all of the following claims to sign up for this exchange.
        \n[ ${vendor?.requiredClaimMnemonics.join(", ")} ]`
      );
    }
  }, [hasAllRequiredClaims]);

  const verifyUserOnProxy = async () => {
    if (vendor) {
      const venderStorage = await exchangeLocalStorage.get();
      if (splitName && dob && address && email) {
        const hashEmail = async () => {
          return Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            email
          );
        };

        const userEmail = await hashEmail();
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
          userId: venderStorage?.userId
        } as UserVerifyRequest;
        await verifyClaims(userClaims, vendor);
      }
      if (expoPushToken) {
        await postTokenToProxy(expoPushToken, vendor);
      }
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: vendor?.backgroundColor }]}
      key={vendor?.name}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.header}>{vendor?.name}</Text>
      <Text style={styles.tagLine}>{vendor?.tagline}</Text>
      <Text style={styles.description}>{vendor?.description}</Text>
      <Image source={{ uri: vendor?.logo }} style={styles.logo} />
      <View style={styles.buttonWrapper}>
        {name && dob && address && email && (
          <View style={styles.buttonWrapper}>
            <Button
              title="Verify My Claims"
              // disabled={signed ? false : true}
              onPress={async () => {
                verifyUserOnProxy();
              }}
            />
          </View>
        )}
        <Button
          onPress={async () => {
            if (vendor && getVendor(vendor.id) && name && email) {
              await signup(name, email, vendor.id);
              setSigned(true);
            } else {
              Alert.alert(
                "Missing Credentials",
                "Please provide your name and email claims to sign up"
              );
            }
          }}
          title="Sign Up"
          disabled={signed || !hasAllRequiredClaims}
          style={styles.button}
        />
        {/* 1 === GPIB */}
        {vendor?.id === 1 && (
          <Button
            onPress={() => {
              Alert.prompt("Enter your GPIB password", "", [
                {
                  text: "OK",
                  onPress: async (value: string | undefined) => {
                    if (name && value && email && dob)
                      await syncDetail(name, value, email, dob, vendor.id);
                  }
                },
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                }
              ]);
            }}
            title="Sync Details"
          />
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

  tagLine: {
    marginVertical: 5,
    fontSize: 15
  },

  button: {
    marginVertical: 5
  }
});
export default VendorDetailsScreen;
