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
import { useClaimValue } from "../../context/ClaimsStore";
import { useExchange } from "../../context/Exchange";
import { findNames, findYOB } from "../../utils/formatters";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { claimStatus, IExchange } from "../../interfaces/exchange-interface";
import useVerifyClaims from "../../hooks/useVerifyClaims";
import * as Crypto from "expo-crypto";
import usePushNotifications from "../../hooks/usePushNotifications";

const VendorDetailsScreen: React.FC = () => {
  const { vendors } = useVendorsList();
  const { expoPushToken } = usePushNotifications();
  const { makeGpibUser, makeCoinstashUser, verifyOnExchange } = useExchange();
  const route = useRoute<VendorStackNavigationRoute<"VendorDetails">>();
  const name = useClaimValue("FullNameCredential");
  const address = useClaimValue("AddressCredential");
  const email = useClaimValue("EmailCredential");
  const dob = useClaimValue("DateOfBirthCredential");
  const yob = findYOB(dob ? dob : "");
  const splitName = findNames(name);
  // const joinAddress = findAddress(address);
  const { verifyClaims, postTokenToProxy } = useVerifyClaims();
  const [status, setStatus] = React.useState<string>();
  const vendor = vendors.find((v) => v.name === route.params.vendorId);

  const verifyOnProxyRequestBody = async () => {
    // const joinAddress = findAddress(address);
    const splitName = findNames(name);
    if (splitName && dob && address && email) {
      Alert.alert(
        "Claims Sent",
        "Please wait while your claims are being verified",
        [
          {
            text: "OK",
            style: "destructive"
          }
        ]
      );
      const userEmail = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        email
      );
      const userClaims = {
        firstName: splitName.firstName,
        lastName: splitName.lastName,
        dob: dob,
        email: userEmail.toString(),
        address: address
        // houseNumber: address.houseNumber,
        // street: address.street,
        // suburb: address.suburb,
        // postcode: address.postcode,
        // state: address.state,
        // country: address.country,
        // userId: address.userId
      };
      await verifyClaims(userClaims);
    }
    if (expoPushToken) {
      await postTokenToProxy(expoPushToken);
    }
    setStatus(claimStatus.PENDING);
  };

  if (!vendor) {
    return null;
  }

  const idToIExchange: { [id: number]: IExchange } = {
    1: makeGpibUser,
    2: makeCoinstashUser
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: vendor.backgroundColor }]}
      key={vendor.name}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.header}>{vendor.name}</Text>
      <Text style={styles.description}>{vendor.description}</Text>
      <Image source={{ uri: vendor.logo }} style={styles.logo} />
      <View style={styles.buttonWrapper}>
        {name && dob && address && email && (
          <View style={styles.buttonWrapper}>
            <Button
              title={
                status === claimStatus.PENDING ? "Pending" : "Verify My Claim"
              }
              disabled={status === claimStatus.PENDING ? true : false}
              onPress={async () => {
                verifyOnProxyRequestBody();
              }}
            />
          </View>
        )}
        <Button
          onPress={() => {
            const makeUser = idToIExchange[vendor.id];
            if (!makeUser) {
              Linking.openURL(vendor.signup);
              return;
            }
            if (name && email) {
              makeUser.signUp(name, email);
            }
          }}
          title="Sign Up"
          disabled={name && email ? false : true}
          style={styles.button}
        />
        {vendor.website === "https://getpaidinbitcoin.com.au" ? (
          <Button
            onPress={() => {
              Alert.prompt("Enter password your GPIB password", "", [
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
