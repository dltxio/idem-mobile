import React, { useEffect } from "react";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ViewStyle
} from "react-native";
import styles from "../../styles";
import { useNavigation } from "@react-navigation/core";
import { observer } from "mobx-react-lite";
import { colors } from "../../styles/theme";
import Profile from "../profile";
import useClaims from "../../hooks/useClaims";
import Button from "../../components/Button";
import { sendOnboarding } from "../../helpers/claim/verify";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ClaimsListItemProps = {
  onPress: () => void;
  claim: any;
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

  const onPressSubmit = async (values: any) => {
    try {
      values = {
        name: "Ralph",
        email: "ralph@ralphlavelle.net",
        dob: "01/01/1990",
        address: "123 Main St",
        mobile: "1234567890"
      };
      const challenge = "8b5c66c0-bceb-40b4-b099-d31b127bf7b3"; // need to move this out of here at some stage
      const presentation = await sendOnboarding(values, challenge);
      console.log(`presentation: ${presentation}`);
      const claims: unknown = [];
      // console.log(`presentation: ${presentation}`)
      // let mappedClaims = [];
      // for (const credential in presentation.verifiableCredential) {
      //   let claim = {
      //     key: credential,
      //     value: presentation.verifiableCredential[credential]
      //   }
      //   mappedClaims.push(claim);
      // }
      if (!!claims) {
        await AsyncStorage.setItem("claims", JSON.stringify(claims)); // mappedClaims));
      }
      //console.log(`>>> claims: ${claims}`);
      fetchClaims();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.list.root as ViewStyle}>
      <StatusBar barStyle="light-content" />
      {claims.length > 0 && (
        <Profile
          fullName={claims.find(c => c.key === "email")?.credentialSubject.value!}
          emailAddress={claims.find(c => c.key === "address")?.credentialSubject.value!}
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
      <Button
        title="Submit"
        style={styles.baseStyle.baseButton}
        onPress={onPressSubmit}
      />
    </View>
  );
};

export default observer(ClaimSelector);
