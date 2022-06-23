import * as React from "react";
import { StyleSheet, View, ScrollView, Text, Dimensions } from "react-native";
import commonStyles from "../../styles/styles";
import { ProfileStackNavigation } from "../../types/navigation";
import { Button, ClaimsList, UserDetailsHeader } from "../../components";
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import { useNavigation } from "@react-navigation/native";
import { ClaimType } from "../../types/claim";
import CreateMnemonicController from "../../components/CreateMnemonicController";
import useVerifyClaims from "../../hooks/useVerifyClaims";
import * as Crypto from "expo-crypto";
import usePushNotifications from "../../hooks/usePushNotifications";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { findNames } from "../../utils/formatters";
import { VerifyOnProxy } from "../../types/general";
import { exchangeLocalStorage } from "../../utils/local-storage";

type Navigation = ProfileStackNavigation<"Home">;

const Home: React.FC = () => {
  const { usersClaims, unclaimedClaims } = useClaimsStore();
  const { verifyClaims, postTokenToProxy } = useVerifyClaims();
  const navigation = useNavigation<Navigation>();
  const { expoPushToken } = usePushNotifications();

  const navigateToClaim = (claimType: ClaimType) => {
    navigation.navigate("Claim", { claimType });
  };

  const name = useClaimValue("FullNameCredential");
  const dob = useClaimValue("DateOfBirthCredential");
  const address = useClaimValue("AddressCredential");
  const addressValue = usersClaims.find(
    (claim) => claim.type === "AddressCredential"
  )?.value;

  const email = useClaimValue("EmailCredential");

  const verifyOnProxyRequestBody = async () => {
    const splitName = findNames(name);
    if (splitName && dob && address && email) {
      const hashEmail = async () => {
        const hashedEmail = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          email
        );
        return hashedEmail;
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
      await verifyClaims(userClaims);
    }
    if (expoPushToken) {
      await postTokenToProxy(expoPushToken);
    }
  };

  return (
    <View style={commonStyles.screen}>
      <UserDetailsHeader />
      <CreateMnemonicController />
      <ScrollView style={commonStyles.screenContent}>
        <Text style={commonStyles.text.smallHeading}>Your claims</Text>
        {usersClaims.length ? (
          <ClaimsList
            claims={usersClaims.filter((c) => !c.hideFromList)}
            onPress={navigateToClaim}
          />
        ) : (
          <View>
            <Text style={styles.emptyClaimsText}>
              You don't have have any claims yet. Get started by verifying a
              claim below.
            </Text>
          </View>
        )}
        {unclaimedClaims.length ? (
          <>
            <Text style={commonStyles.text.smallHeading}>All claims</Text>
            <ClaimsList
              claims={unclaimedClaims.filter((c) => !c.hideFromList)}
              onPress={navigateToClaim}
            />
          </>
        ) : null}
        <BottomNavBarSpacer />
      </ScrollView>
      {name && dob && address && email && (
        <View style={styles.buttonWrapper}>
          <Button
            title="Verify My Claims"
            onPress={async () => {
              verifyOnProxyRequestBody();
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  emptyClaimsText: {
    marginBottom: 10
  },
  buttonWrapper: {
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.9
  }
});
