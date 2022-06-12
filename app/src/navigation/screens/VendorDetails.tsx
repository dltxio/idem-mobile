import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { View, Image, StyleSheet, Text, Dimensions } from "react-native";
import { Button } from "../../components";
import useVendorsList from "../../hooks/useVendorsList";
import { VendorStackNavigationRoute } from "../../types/navigation";
import { useExchange } from "../../context/Exchange";
import { useClaimValue } from "../../context/ClaimsStore";

const VendorDetailsScreen: React.FC = () => {
  const { vendors } = useVendorsList();
  const { makeGpibUser } = useExchange();
  const route = useRoute<VendorStackNavigationRoute<"VendorDetails">>();
  const name = useClaimValue("FullNameCredential");
  console.log(name, "name");
  const email = useClaimValue("EmailCredential");
  console.log(email, "email");
  const vendor = vendors.find((v) => v.name === route.params.vendorId);

  if (!vendor) {
    return null;
  }

  return (
    <View style={styles.container} key={vendor.name}>
      <Text style={styles.header}>{vendor.name}</Text>
      <Text style={styles.description}>{vendor.description}</Text>
      <Image source={{ uri: vendor.logo }} style={styles.logo} />
      <View style={styles.button}>
        <Button
          onPress={() => makeGpibUser(name, email)}
          title="Sign Up"
          disabled={name && email ? false : true}
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
    height: 120,
    backgroundColor: "gray"
  },

  button: {
    width: Dimensions.get("window").width * 0.9,
    marginTop: Dimensions.get("window").height / 2.5
  }
});

export default VendorDetailsScreen;
