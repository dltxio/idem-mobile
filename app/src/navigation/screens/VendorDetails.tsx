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
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import useVendors from "../../hooks/userVendors";
import { getVendor } from "../../utils/vendor";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { ClaimTypeConstants } from "../../constants/common";
import { getClaimsFromTypes } from "../../utils/claim-utils";

const VendorDetailsScreen: React.FC = () => {
  const { usersClaims } = useClaimsStore();
  const { vendors } = useVendorsList();
  const route = useRoute<VendorStackNavigationRoute<"VendorDetails">>();
  const vendor = vendors.find((v) => v.id == route.params.id);
  const [signed, setSigned] = React.useState<boolean>(false);
  const { signup, syncDetail } = useVendors();
  const email = useClaimValue(ClaimTypeConstants.EmailCredential);
  const dob = useClaimValue(ClaimTypeConstants.BirthCredential);
  const name = useClaimValue(ClaimTypeConstants.NameCredential);

  const hasAllRequiredClaims = React.useMemo(() => {
    if (!vendor || !vendor.requiredClaimTypes) {
      return true;
    }

    const userClaimTypeMap = usersClaims.reduce(
      (acc, claim) => {
        acc[claim.type] = true;
        return acc;
      },
      {} as {
        [key: string]: boolean;
      }
    );

    return vendor.requiredClaimTypes.every(
      (claimType) => userClaimTypeMap[claimType]
    );
  }, [usersClaims, vendor]);

  React.useEffect(() => {
    if (!hasAllRequiredClaims) {
      const requiredClaims = getClaimsFromTypes(
        vendor?.requiredClaimTypes ?? []
      );
      const requirements = requiredClaims.map((claim) => claim.title);
      Alert.alert(
        "Missing required claims",
        `You must have all of the following claims to sign up for this exchange.
        \n[ ${requirements.join(", ")} ]`
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
      <Image
        source={{ uri: vendor?.logo }}
        style={styles.logo}
        resizeMode="center"
      />
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
    textAlign: "center"
  },

  logo: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height / 3
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
