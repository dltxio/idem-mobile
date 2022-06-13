import * as React from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import commonStyles from "../../styles/styles";
import { ProfileStackNavigation } from "../../types/navigation";
import { ClaimsList, UserDetailsHeader } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useNavigation } from "@react-navigation/native";
import { ClaimType } from "../../types/claim";
import CreateMnemonicController from "../../components/CreateMnemonicController";
import VerificationFiles from "../../components/VerifyClaims";

type Navigation = ProfileStackNavigation<"Home">;

const Home: React.FC = () => {
  const { usersClaims, unclaimedClaims } = useClaimsStore();
  const navigation = useNavigation<Navigation>();

  const navigateToClaim = (claimType: ClaimType) => {
    navigation.navigate("Claim", { claimType });
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
      <VerificationFiles
        claim={{
          type: "18+",
          key: "",
          nnemonic: "",
          title: "",
          description: "",
          verificationAction: "document-upload",
          fields: [],
          verificationDocuments: [],
          hideFromList: undefined
        }}
        selectedFileIds={[]}
        onSelectFile={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  emptyClaimsText: {
    marginBottom: 10
  }
});
