import { useRoute } from "@react-navigation/native";
import * as React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  Linking
} from "react-native";
import { Button } from "../../components";
import useVendorsList from "../../hooks/useVendorsList";
import { VendorStackNavigationRoute } from "../../types/navigation";
import { useClaimValue } from "../../context/ClaimsStore";
import { useExchange } from "../../context/Exchange";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";

const VendorDetailsScreen: React.FC = () => {
  const { vendors } = useVendorsList();
  const { makeGpibUser, makeCoinstashUser } = useExchange();
  const route = useRoute<VendorStackNavigationRoute<"VendorDetails">>();
  const name = useClaimValue("FullNameCredential");
  const email = useClaimValue("EmailCredential");
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
      <View style={styles.button}>
        <Button
          onPress={() => {
            vendor.id === 1
              ? makeGpibUser(name, email)
              : vendor.id === 2
              ? makeCoinstashUser(name, email)
              : Linking.openURL(vendor.signup);
          }}
          title="Sign Up"
          disabled={name && email ? false : true}
        />
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

  button: {
    width: Dimensions.get("window").width * 0.9,
    marginTop: Dimensions.get("window").height / 2.5
  }
});

export default VendorDetailsScreen;
