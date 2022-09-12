import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Dimensions,
  StatusBar
} from "react-native";
import commonStyles from "../../styles/styles";
import { ProfileStackNavigation } from "../../types/navigation";
import { ClaimsList, UserDetailsHeader } from "../../components";
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import { useNavigation } from "@react-navigation/native";
import { ClaimType } from "../../types/claim";
import usePushNotifications from "../../hooks/usePushNotifications";
import CreateMnemonicController from "../../components/CreateMnemonicController";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { findNames } from "../../utils/formatters";
import { UserVerifyRequest } from "../../types/user";
import useVerifyClaims from "../../hooks/useVerifyClaims";
import { ClaimTypeConstants } from "../../constants/common";
import IdemButton from "../../components/Button";
import { ethers } from "ethers";

type Navigation = ProfileStackNavigation<"Home">;

const Home: React.FC = () => {
  const { usersClaims, unclaimedClaims } = useClaimsStore();
  const navigation = useNavigation<Navigation>();
  const { expoPushToken } = usePushNotifications();
  const navigateToClaim = (claimType: ClaimType) => {
    navigation.navigate("Claim", { claimType });
  };
  const address = useClaimValue(ClaimTypeConstants.AddressCredential);
  const email = useClaimValue(ClaimTypeConstants.EmailCredential);
  const dob = useClaimValue(ClaimTypeConstants.BirthCredential);
  const name = useClaimValue(ClaimTypeConstants.NameCredential);
  const splitName = findNames(name);
  const addressValue = usersClaims.find(
    (claim) => claim.type === ClaimTypeConstants.AddressCredential
  )?.value;
  const { verifyClaims } = useVerifyClaims();
  const verifyUserOnProxy = async () => {
    if (splitName && dob && address && email) {
      const formattedEmail = email.trim().toLowerCase();
      const hashEmail = ethers.utils.hashMessage(formattedEmail);

      const userClaims = {
        firstName: splitName.firstName,
        lastName: splitName.lastName,
        dob,
        hashEmail,
        houseNumber: addressValue.houseNumber,
        street: addressValue.street,
        suburb: addressValue.suburb,
        postcode: addressValue.postCode,
        state: addressValue.state,
        country: addressValue.country
      } as UserVerifyRequest;

      await verifyClaims(userClaims, expoPushToken);
    }
  };

  return (
    <View style={commonStyles.screen}>
      <StatusBar hidden={false} />
      <UserDetailsHeader />
      <CreateMnemonicController />
      <ScrollView style={commonStyles.screenContent}>
        <Text style={commonStyles.text.smallHeading}>Your Claims</Text>
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
            <Text style={commonStyles.text.smallHeading}>All Claims</Text>
            <ClaimsList
              claims={unclaimedClaims.filter((c) => !c.hideFromList)}
              onPress={navigateToClaim}
            />
          </>
        ) : null}
        <View style={styles.buttonWrapper}>
          {name && dob && address && email && (
            <View style={styles.buttonWrapper}>
              <IdemButton
                title="Verify My Claims"
                // disabled={signed ? false : true}
                onPress={async () => {
                  verifyUserOnProxy();
                }}
              />
            </View>
          )}
        </View>
        <BottomNavBarSpacer />
      </ScrollView>
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
