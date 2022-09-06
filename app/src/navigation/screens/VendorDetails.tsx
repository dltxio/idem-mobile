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
  const { signup } = useVendors();
  const email = useClaimValue(ClaimTypeConstants.EmailCredential);
  const dob = useClaimValue(ClaimTypeConstants.BirthCredential);
  const name = useClaimValue(ClaimTypeConstants.NameCredential);
  const mobile = useClaimValue(ClaimTypeConstants.MobileCredential);

  const missingClaimTypes = React.useMemo(() => {
    if (!vendor || !vendor.requiredClaimTypes) {
      return [];
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
    return vendor.requiredClaimTypes.filter(
      (claimType) => !userClaimTypeMap[claimType]
    );
  }, [usersClaims, vendor]);

  const hasAllRequiredClaims = missingClaimTypes.length === 0;

  const requirementText = React.useMemo(() => {
    if (hasAllRequiredClaims) return "";
    const missingClaims = getClaimsFromTypes(missingClaimTypes);
    const missingClaimsTitle = missingClaims.map((claim) => claim.title);

    if (missingClaimsTitle.length === 1) return missingClaimsTitle[0];
    return (
      missingClaimsTitle.slice(0, -1).join(", ") +
      " and " +
      missingClaimsTitle.slice(-1)
    );
  }, [missingClaimTypes]);

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

      <View style={{ height: 80 }}>
        {!hasAllRequiredClaims && (
          <View style={{ marginTop: 30 }}>
            <Text style={{ textAlign: "center" }}>
              {vendor?.name} requires your {requirementText} to be completed.
            </Text>
          </View>
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          onPress={async () => {
            if (vendor && getVendor(vendor.id) && name && email) {
              //TODO: Quick fix for now, need update this with new sites.json
              const userClaim = usersClaims.find(
                (claim) => claim.type === ClaimTypeConstants.EmailCredential
              );
              if (!userClaim?.verified) {
                Alert.alert(
                  "Email not verified",
                  "Please verify your email before signing up"
                );
                return;
              }
              await signup({ name, email, mobile, dob }, vendor.id);
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
        />
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
    marginTop: 50
  },
  tagLine: {
    marginVertical: 5,
    fontSize: 15
  }
});
