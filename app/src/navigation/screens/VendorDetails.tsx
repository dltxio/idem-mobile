import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { View, Image, StyleSheet, Text, Dimensions, Alert } from "react-native";
import { Button } from "../../components";
import useVendorsList from "../../hooks/useVendorsList";
import { VendorStackNavigationRoute } from "../../types/navigation";
import { useClaimValue } from "../../context/ClaimsStore";
import axios from "axios";
import * as password from "secure-random-password";

const VendorDetailsScreen: React.FC = () => {
  const { vendors } = useVendorsList();
  const route = useRoute<VendorStackNavigationRoute<"VendorDetails">>();

  const vendor = vendors.find((v) => v.name === route.params.vendorId);

  if (!vendor) {
    return null;
  }

  const shareDetailsAlert = () => {
    Alert.alert(
      "Share Details",
      "You have just signed up with GPIB, your temporary password is" +
        randomTempPassword,
      [
        {
          text: "OK",
          onPress: () => console.log(""),
          style: "destructive"
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      {
        cancelable: true
      }
    );
  };

  const name = useClaimValue("FullNameCredential");
  const email = useClaimValue("EmailCredential");
  const randomTempPassword = password.randomPassword({
    length: 10,
    characters: [password.lower, password.upper, password.digits]
  });

  const body = JSON.stringify({
    fullName: name,
    email: email,
    password: randomTempPassword,
    referralCode: " ",
    trackAddress: " ",
    CreateAddress: " "
  });

  const makeGpibUser = async () => {
    console.log("GMGMGMGMGMGMG" + name);
    if (name && email) {
      const respone = await axios.post(
        "https://testapi.getpaidinbitcoin.com.au/user",
        body,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log(respone);
      // const res = makeGpibUser();
      // if (res && res.type === "success") {
      shareDetailsAlert();
    }
  };
  //   }
  // }

  return (
    <View style={styles.container} key={vendor.name}>
      <Text style={styles.header}>{vendor.name}</Text>
      <Text style={styles.description}>{vendor.description}</Text>
      <Image source={{ uri: vendor.logo }} style={styles.logo} />
      <View style={styles.button}>
        <Button onPress={() => makeGpibUser} title="Sign Up" />
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
    width: Dimensions.get("window").width,
    marginTop: Dimensions.get("window").height * 0.2
  }
});

export default VendorDetailsScreen;
