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
import { PartnersStackNavigationRoute } from "../../types/navigation";
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import useVendors from "../../hooks/userVendors";
import { getPartner, getUnVerifiedClaimText } from "../../utils/partner";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { AlertTitle, ClaimTypeConstants } from "../../constants/common";
import { verificationStorage } from "../../utils/local-storage";

const VendorDetailsScreen: React.FC = () => {
  const { partners } = useVendorsList();
  const { usersClaims } = useClaimsStore();
  const route = useRoute<PartnersStackNavigationRoute<"VendorDetails">>();
  const partner = partners.find((v) => v.id == route.params.id);
  const [signed, setSigned] = React.useState<boolean>(false);
  const { signup } = useVendors();
  const email = useClaimValue(ClaimTypeConstants.EmailCredential);
  const dob = useClaimValue(ClaimTypeConstants.BirthCredential);
  const name = useClaimValue(ClaimTypeConstants.NameCredential);
  const mobile = useClaimValue(ClaimTypeConstants.MobileCredential);

  const unVerifiedClaimsText = getUnVerifiedClaimText(partner, usersClaims);

  const vendorSignUp = async () => {
    if (partner && getPartner(partner.id) && name && email) {
      const verification = await verificationStorage.get();
      if (partner.verifyClaims && !verification) {
        return Alert.alert(
          AlertTitle.Warning,
          "Please go to profile screen and verify your claims before signing up."
        );
      }
      await signup({ name, email, mobile, dob }, partner);
      setSigned(true);
    } else {
      Alert.alert(
        "Missing Credentials",
        "Please provide your name and email claims to sign up."
      );
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: partner?.backgroundColor }]}
      key={partner?.name}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.header}>{partner?.name}</Text>
      <Text style={styles.tagLine}>{partner?.tagline}</Text>
      <Text style={styles.description}>{partner?.description}</Text>
      <Image
        source={{ uri: partner?.logo }}
        style={styles.logo}
        resizeMode="center"
      />

      <View style={{ height: 80 }}>
        {unVerifiedClaimsText !== undefined && (
          <View style={styles.requiredClaimView}>
            <Text style={styles.requiredClaimText}>
              {partner?.name} requires your {unVerifiedClaimsText}.
            </Text>
          </View>
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          onPress={vendorSignUp}
          title="Sign Up"
          disabled={signed || unVerifiedClaimsText !== undefined}
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
  },
  requiredClaimText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "bold"
  },
  requiredClaimView: { marginTop: 30, marginLeft: 5, marginRight: 5 }
});