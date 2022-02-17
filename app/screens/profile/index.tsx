import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-elements";
import { IClaim } from "../../store/assetStore";
import { observer } from "mobx-react-lite";

const styles = StyleSheet.create({
  userRow: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
});
const Profile: React.FC<{
  fullName: string;
  emailAddress: string;
}> = ({ fullName, emailAddress }) => {
  return (
    <View style={styles.userRow}>
      <View style={styles.userImage}>
        <Avatar
          rounded
          size="large"
          source={{ uri: "https://i.imgur.com/FmeKYGe.jpg" }}
        />
      </View>
      <View>
        <Text style={{ fontSize: 16 }}>{fullName}</Text>
        <Text
          style={{
            color: "gray",
            fontSize: 16,
          }}
        >
          {emailAddress}
        </Text>
      </View>
    </View>
  );
};

export default observer(Profile);
