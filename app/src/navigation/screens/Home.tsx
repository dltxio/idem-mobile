import * as React from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import commonStyles from "../../styles/styles";
import { ProfileStackNavigation } from "../../types/navigation";
import { Button, ClaimsList, UserDetailsHeader } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useNavigation } from "@react-navigation/native";
import { ClaimType } from "../../types/claim";
import CreateMnemonicController from "../../components/CreateMnemonicController";
import usePushNotifications from "../../hooks/usePushNotification";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";

type Navigation = ProfileStackNavigation<"Home">;

const Home: React.FC = () => {
  const { usersClaims, unclaimedClaims } = useClaimsStore();
  const navigation = useNavigation<Navigation>();
  const { expoPushToken, notification, sendPushNotification } =
    usePushNotifications();

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
        {/* 
        NOTIFICATION STUFFS 
        Try sending a custom one from: https://expo.dev/notifications
        */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around"
          }}
        >
          <Text>Your expo push token: {expoPushToken}</Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>
              Title: {notification && notification.request.content.title}{" "}
            </Text>
            <Text>
              Body: {notification && notification.request.content.body}
            </Text>
            <Text>
              Data:{" "}
              {notification &&
                JSON.stringify(notification.request.content.data)}
            </Text>
          </View>
          <Button
            title="Press to Send Notification"
            onPress={async () => {
              await sendPushNotification(expoPushToken);
            }}
          />
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
  }
});
