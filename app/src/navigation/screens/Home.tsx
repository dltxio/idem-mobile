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

type Navigation = ProfileStackNavigation<"Home">;

const Home: React.FC = () => {
  const { usersClaims, unclaimedClaims } = useClaimsStore();
  const { verifyClaims } = useVerifyClaims();
  const navigation = useNavigation<Navigation>();

  const navigateToClaim = (claimType: ClaimType) => {
    navigation.navigate("Claim", { claimType });
  };

  const userClaims = {
    name: useClaimValue("FullNameCredential"),
    dob: useClaimValue("DateOfBirthCredential"),
    email: useClaimValue("EmailCredential"),
    address: useClaimValue("AddressCredential")
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
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          title="Verify My Claims"
          onPress={() => verifyClaims(userClaims)}
        />
      </View>
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
