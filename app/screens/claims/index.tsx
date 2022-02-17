import React, { useEffect } from "react";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import styles from "../../styles";
import { useNavigation } from "@react-navigation/core";
import { observer } from "mobx-react-lite";
import { colors } from "../../styles/theme";
import Profile from "../profile";
import useClaims from "../../hooks/useClaims";

type ClaimsListItemProps = {
  onPress: () => void;
  claim: server.Claim;
};

const ClaimListItem = ({ onPress, claim }: ClaimsListItemProps) => {
  const value = claim.credentialSubject.value;
  return (
    <TouchableOpacity
      style={styles.list.itemWrapper(styles.layout.window)}
      onPress={onPress}
    >
      <Text style={styles.list.itemName}>{claim.title}</Text>
      {!value ? (
        <View
          style={{
            padding: 5,
            borderRadius: 5,
            borderColor: colors.gray,
            position: "absolute",
            right: 30,
            top: 30,
            borderWidth: 1,
          }}
        >
          <Text>Not Supplied</Text>
        </View>
      ) : !claim.proof ? (
        <View
          style={{
            padding: 5,
            borderRadius: 5,
            borderColor: colors.gray,
            position: "absolute",
            right: 30,
            top: 30,
            borderWidth: 1,
          }}
        >
          <Text>Not Verified</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const ClaimSelector = () => {
  const navigation = useNavigation();
  const { claims, isLoading, setSelectedClaim, fetchClaims } = useClaims();

  useEffect(() => {
    fetchClaims();
  }, []);
  if (isLoading)
    return (
      <View style={styles.list.root as ViewStyle}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.list.root as ViewStyle}>
      <StatusBar barStyle="light-content" />
      {claims.length > 0 && (
        <Profile
          fullName={claims.find((c) => c.key === "0x02")?.credentialSubject.value!}
          emailAddress={claims.find((c) => c.key === "0x03")?.credentialSubject.value!}
        />
      )}
      <View style={{ flex: 1, width: "100%" }}>
        {claims.map((claim, index) => {
          return (
            <ClaimListItem
              key={index}
              claim={claim}
              onPress={() => {
                setSelectedClaim(claim);
                navigation.navigate("Claim");
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

export default observer(ClaimSelector);
