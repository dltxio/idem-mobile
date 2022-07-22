import { useRoute } from "@react-navigation/native";
import * as React from "react";
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Alert,
  View,
  ScrollView
} from "react-native";
import { Button } from "../../components";
import useVendorsList from "../../hooks/useVendorsList";
import { VendorStackNavigationRoute } from "../../types/navigation";
import useVerifyClaims from "../../hooks/useVerifyClaims";
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import usePushNotifications from "../../hooks/usePushNotifications";
import useVendors from "../../hooks/userVendors";
import { getVendor } from "../../utils/vendor";
import { findNames } from "../../utils/formatters";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";

const VendorDetailsScreen: React.FC = () => {
  const { usersClaims } = useClaimsStore();
  const { vendors } = useVendorsList();
  const {} = usePushNotifications();
  const route = useRoute<VendorStackNavigationRoute<"VendorDetails">>();
  const {} = useVerifyClaims();
  const vendor = vendors.find((v) => v.id == route.params.id);
  const [] = React.useState<boolean>(false);
  const {} = useVendors();
  const [signed, setSigned] = React.useState<boolean>(false);
  const { signup, syncDetail } = useVendors();

  const email = useClaimValue("EmailCredential");
  const dob = useClaimValue("BirthCredential");
  const name = useClaimValue("NameCredential");

  const hasAllRequiredClaims = React.useMemo(() => {
    if (!vendor || !vendor.requiredClaimMnemonics) {
      return true;
    }

    const userClaimMnemonicMap = usersClaims.reduce(
      (acc, claim) => {
        acc[claim.mnemonic] = true;
        return acc;
      },
      {} as {
        [key: string]: boolean;
      }
    );

    return vendor.requiredClaimMnemonics.every(
      (mnemonic) => userClaimMnemonicMap[mnemonic]
    );
  }, [usersClaims, vendor]);

  React.useEffect(() => {
    if (!hasAllRequiredClaims) {
      Alert.alert(
        "Missing required claims",
        `You must have all of the following claims to sign up for this exchange.
        \n[ ${vendor?.requiredClaimMnemonics.join(", ")} ]`
      );
    }
  }, [hasAllRequiredClaims]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: vendor?.backgroundColor }]}
      key={vendor?.name}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.header}>{vendor?.name}</Text>
      <Text style={styles.tagLine}>{vendor?.tagline}</Text>
      <Text style={styles.description}>{vendor?.description}</Text>
      <Image source={{ uri: vendor?.logo }} style={styles.logo} />
      <View style={styles.buttonWrapper}>
        <Button
          onPress={async () => {
            if (vendor && getVendor(vendor.id) && name && email) {
              await signup(name, email, vendor.id);
              setSigned(true);
            } else {
              Alert.alert(
                "Missing Credentials",
                "Please provide your name and email claims to sign up"
              );
            }
          }}
          title="Sign Up"
          disabled={signed || !hasAllRequiredClaims}
          style={styles.button}
        />
        {/* 1 === GPIB */}
        {vendor?.id === 1 && (
          <Button
            onPress={() => {
              Alert.prompt("Enter your GPIB password", "", [
                {
                  text: "OK",
                  onPress: async (value: string | undefined) => {
                    if (name && value && email && dob)
                      await syncDetail(name, value, email, dob, vendor.id);
                  }
                },
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                }
              ]);
            }}
            title="Sync Details"
          />
        )}
      </View>
      <BottomNavBarSpacer />
    </ScrollView>
  );
};
export default VendorDetailsScreen;

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
    marginTop: Dimensions.get("window").height / 6,
    justifyContent: "space-around"
  },

  tagLine: {
    marginVertical: 5,
    fontSize: 15
  },

  button: {
    marginVertical: 5
  }
});
