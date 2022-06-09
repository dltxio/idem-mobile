import * as React from "react";
import { StyleSheet, View, ScrollView, Text, Alert } from "react-native";
import commonStyles from "../../styles/styles";
import { ProfileStackNavigation } from "../../types/navigation";
import { Button, ClaimsList, UserDetailsHeader } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useNavigation } from "@react-navigation/native";
import { ClaimType } from "../../types/claim";
import CreateMnemonicController from "../../components/CreateMnemonicController";
import {
  claimsLocalStorage,
  fileLocalStorage,
  mnemonicLocalStorage,
  pgpLocalStorage
} from "../../utils/local-storage";

type Navigation = ProfileStackNavigation<"Home">;

const Home: React.FC = () => {
  const { usersClaims, unclaimedClaims } = useClaimsStore();
  const navigation = useNavigation<Navigation>();

  const navigateToClaim = (claimType: ClaimType) => {
    navigation.navigate("Claim", { claimType });
  };

  const resetAlert = () => {
    const resetData = async () => {
      await claimsLocalStorage.clear();
      await fileLocalStorage.clear();
      await mnemonicLocalStorage.clear();
      await pgpLocalStorage.clear();
    };
    Alert.alert(
      "WARNING:",
      "This will reset all of your app data, including wallet, documents, and claims. Would you like to continue?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => resetData() }
      ]
    );
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
        <Button onPress={resetAlert} title="Reset Profile" />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  emptyClaimsText: {
    marginBottom: 10
  }
});
