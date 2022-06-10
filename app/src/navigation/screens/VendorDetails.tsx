import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { View, Image, StyleSheet, Text, Dimensions } from "react-native";
import { Button } from "../../components";
import useVendorsList from "../../hooks/useVendorsList";
import { VendorStackNavigationRoute } from "../../types/navigation";
import * as Linking from "expo-linking";

const VendorDetailsScreen: React.FC = () => {
  const { vendors } = useVendorsList();
  const route = useRoute<VendorStackNavigationRoute<"VendorDetails">>();

  const vendor = vendors.find((v) => v.name === route.params.vendorId);

  if (!vendor) {
    return null;
  }

  return (
    <View style={styles.container} key={vendor.name}>
      <Text style={styles.header}>{vendor.name}</Text>
      <Text style={styles.description}>{vendor.description}</Text>
      <View style={{ backgroundColor: vendor.backgroundColor }}>
        <Image source={{ uri: vendor.logo }} style={styles.logo} />
      </View>
      <View style={styles.button}>
        <Button
          onPress={() => Linking.openURL(vendor.signup)}
          title="Sign Up"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    height: Dimensions.get("window").height
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
    width: Dimensions.get("window").width,
    marginTop: Dimensions.get("window").height * 0.2
  }
});

export default VendorDetailsScreen;
