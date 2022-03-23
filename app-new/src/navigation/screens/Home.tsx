import * as React from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { Avatar } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../styles/colors";
import commonStyles from "../../styles/styles";
import { ProfileStackNavigation } from "../../types/navigation";
import { ClaimsList } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useNavigation } from "@react-navigation/native";
import { ClaimType } from "../../types/claim";

type Navigation = ProfileStackNavigation<"Home">;

const Home: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { usersClaims, unclaimedClaims } = useClaimsStore();
  const navigation = useNavigation<Navigation>();

  const navigateToClaim = (claimType: ClaimType) => {
    navigation.navigate("Claim", { claimType });
  };

  return (
    <View style={commonStyles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Avatar
          rounded
          size="large"
          source={{
            uri: "https://www.pngkit.com/png/detail/126-1262807_instagram-default-profile-picture-png.png"
          }}
        />
        <View style={styles.userDetails}>
          <View style={styles.userDetailPlaceholder} />
          <View style={[styles.userDetailPlaceholder, { width: 150 }]} />
        </View>
      </View>

      <ScrollView style={commonStyles.screenContent}>
        <Text style={commonStyles.text.smallHeading}>Your claims</Text>
        {usersClaims.length ? (
          <ClaimsList claims={usersClaims} onPress={navigateToClaim} />
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
            <ClaimsList claims={unclaimedClaims} onPress={navigateToClaim} />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 99,
    ...commonStyles.dropShadow
  },
  userDetails: {
    marginLeft: 10
  },
  userDetailPlaceholder: {
    height: 10,
    width: 90,
    backgroundColor: "grey",
    marginTop: 3
  },
  emptyClaimsText: {
    marginBottom: 10
  }
});
