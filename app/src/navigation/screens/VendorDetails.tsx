import { useRoute } from "@react-navigation/native";
import * as React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  Linking,
  Alert
} from "react-native";
import { Button } from "../../components";
import useVendorsList from "../../hooks/useVendorsList";
import { VendorStackNavigationRoute } from "../../types/navigation";
import { useClaimValue } from "../../context/ClaimsStore";
import { useExchange } from "../../context/Exchange";
import { findNames, findYOB } from "../../utils/formatters";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";

const VendorDetailsScreen: React.FC = () => {
  const { vendors } = useVendorsList();
  const { makeGpibUser, makeCoinstashUser, verifyOnExchange } = useExchange();
  const route = useRoute<VendorStackNavigationRoute<"VendorDetails">>();
  const name = useClaimValue("FullNameCredential");
  const email = useClaimValue("EmailCredential");
  const dob = useClaimValue("DateOfBirthCredential");
  const yob = findYOB(dob ? dob : "");
  const splitName = findNames(name);

  const vendor = vendors.find((v) => v.name === route.params.vendorId);

  if (!vendor) {
    return null;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: vendor.backgroundColor }]}
      key={vendor.name}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.header}>{vendor.name}</Text>
      <Text style={styles.description}>{vendor.description}</Text>
      <Image source={{ uri: vendor.logo }} style={styles.logo} />
      <View style={styles.buttonWrapper}>
        <Button
          onPress={() => {
            vendor.website === "https://getpaidinbitcoin.com.au"
              ? makeGpibUser(name, email)
              : vendor.name === "Coinstash"
              ? makeCoinstashUser(name, email)
              : Linking.openURL(vendor.signup);
          }}
          title="Sign Up"
          disabled={name && email ? false : true}
          style={styles.button}
        />
        {vendor.website === "https://getpaidinbitcoin.com.au" ? (
          <Button
            onPress={() => {
              Alert.prompt("Enter password your GPIB password", "", [
                {
                  text: "OK",
                  onPress: async (value: string | undefined) => {
                    await verifyOnExchange(
                      email,
                      value,
                      splitName?.firstName,
                      splitName?.lastName,
                      yob
                    );
                  }
                }
              ]);
            }}
            title="Sync Details"
          />
        ) : (
          <Text></Text>
        )}
      </View>
      <BottomNavBarSpacer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height
  },

  scrollContent: {
    justifyContent: "flex-start",
    alignItems: "center"
  },

  header: {
    fontSize: 30,
    marginTop: 10
  },

  description: {
    marginVertical: 20,
    width: Dimensions.get("window").width * 0.9
  },

  logo: {
    width: 170,
    height: 120
  },

  buttonWrapper: {
    width: Dimensions.get("window").width * 0.9,
    marginTop: Dimensions.get("window").height / 2.5,
    justifyContent: "space-around"
  },
  button: {
    marginVertical: 5
  }
});

export default VendorDetailsScreen;
