import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { View, Image, StyleSheet, Text, Dimensions, Alert } from "react-native";
import { Button } from "../../components";
import useVendorsList from "../../hooks/useVendorsList";
import { VendorStackNavigationRoute } from "../../types/navigation";
import { useClaimValue } from "../../context/ClaimsStore";
import * as password from "secure-random-password";
import axios from "axios";

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
      `You have just signed up with ${vendor.name}, your temporary password is ${randomTempPassword}`,
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

  const makeCoinStashUser = async () => {
    const body = JSON.stringify({
      email: email,
      password: randomTempPassword,
      acceptMarketing: true,
      displayName: name,
      country: "Australia",
      token:
        "03AGdBq27KVpnMB7gMZ5cFs1ldEgu1ojl7-8mE6_zjJC1xM3plgAfHcEPy6Pqa2HIqGmD2OBAUIC_9YWcgQTk-Gi0rKe-Xx9VTjcSUwxWXjxO5koYZSVrAw0zTUB7RPcEO1ZvudSyv4eu59iV-T-SpJNhsEMXuAYmzlvsUIBRmFJO1E3dVODRYeMoDtfV8f_MbcCYgqhfBJBQYll8df2D4BofGFelWpDF0KNdSFjdvGEhqZGF7hgy5qUJSjuxP6Ufs9f_8eYFiK1M8xeu6iO4OOIsksD0DdwKBQwa3JPLYOEwPerUwEVBcweuutJ82hpXEbtlMMBTzz2QDRbbQrPT6MEQ4Cj2scA2tS0jUpK_fYtkVUfzU7w4Y1upmAPL6XnPPRfSczdsBEaA1DtvchpkgFo2Zg5G1WoZrOkwnaxiSPw3RmDrHx1oLcfGWXBt8TkmfmjSI0-DFVgCN"
    });
    console.log(body);
    if (name && email) {
      try {
        await axios.post("https://coinstash.com.au/api/auth/signup", body, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        shareDetailsAlert();
      } catch (error: any) {
        console.log(error.response.data);
        Alert.alert(error.response.data);
      }
    }
  };

  return (
    <View style={styles.container} key={vendor.name}>
      <Text style={styles.header}>{vendor.name}</Text>
      <Text style={styles.description}>{vendor.description}</Text>
      <Image source={{ uri: vendor.logo }} style={styles.logo} />
      <View style={styles.button}>
        <Button onPress={makeCoinStashUser} title="Sign Up" />
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
