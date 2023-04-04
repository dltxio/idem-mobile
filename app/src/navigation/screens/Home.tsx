import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  StatusBar,
  Alert
} from "react-native";
import commonStyles from "../../styles/styles";
import { ProfileStackNavigation } from "../../types/navigation";
import { ClaimsList, UserDetailsHeader } from "../../components";
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import { useNavigation } from "@react-navigation/native";
import usePushNotifications from "../../hooks/usePushNotifications";
import CreateMnemonicController from "../../components/CreateMnemonicController";
import { findNames } from "../../utils/formatters";
import { Address, UserVerifyRequest } from "../../types/user";
import useVerifyClaims from "../../hooks/useVerifyClaims";
import { AlertTitle, ClaimTypeConstants } from "../../constants/common";
import IdemButton from "../../components/Button";
import { ethers } from "ethers";
import {
  getClaimScreenByType,
  userCanVerify,
  userHasVerified
} from "../../utils/claim-utils";
import { useDocumentStore } from "../../context/DocumentStore";
import {
  getLicenceValuesAsObject,
  getMedicareValuesAsObject,
  splitDob
} from "../../utils/document-utils";

type Navigation = ProfileStackNavigation<"Home">;

const Home: React.FC = () => {
  const { usersClaims, unclaimedClaims } = useClaimsStore();
  const { documents } = useDocumentStore();
  const navigation = useNavigation<Navigation>();
  const { expoPushToken } = usePushNotifications();

  const navigateToClaim = (claimType: ClaimTypeConstants) => {
    const screenName = getClaimScreenByType(claimType);
    if (screenName) {
      navigation.navigate(screenName);
    }
  };
  const email = useClaimValue(ClaimTypeConstants.EmailCredential);
  const dob = useClaimValue(ClaimTypeConstants.BirthCredential);
  const name = useClaimValue(ClaimTypeConstants.NameCredential);
  const splitName = findNames(name);
  const addressValue = usersClaims.find(
    (claim) => claim.type === ClaimTypeConstants.AddressCredential
  )?.value;
  const { verifyClaims } = useVerifyClaims();
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);

  const canVerify = React.useMemo(() => {
    return userCanVerify(usersClaims, documents);
  }, [usersClaims, documents]);

  const hasVerified = React.useMemo(() => {
    return userHasVerified(usersClaims);
  }, [usersClaims, documents]);

  const verifyUserOnProxy = async () => {
    if (splitName && email) {
      setIsVerifying(true);
      await new Promise((resolve) => {
        setTimeout(resolve, 1);
      });
      try {
        const formattedEmail = email.trim().toLowerCase();
        const hashEmail = ethers.utils.hashMessage(formattedEmail);
        const licenceDocument = documents.find(
          (doc) => doc.type === "drivers-licence"
        );
        const medicareDocument = documents.find(
          (doc) => doc.type === "medicare-card"
        );

        const address = addressValue
          ? ({
              streetNumber: addressValue.houseNumber,
              streetName: addressValue.street,
              streetType: addressValue.streetType,
              suburb: addressValue.suburb,
              postcode: addressValue.postCode,
              state: addressValue.state,
              country: addressValue.country
            } as Address)
          : undefined;

        const userClaims = {
          fullName: {
            givenName: splitName.firstName,
            middleNames: splitName.middleName,
            surname: splitName.lastName
          },
          dob: splitDob(dob),
          hashEmail,
          address: address,
          driversLicence: getLicenceValuesAsObject(licenceDocument),
          medicareCard: getMedicareValuesAsObject(medicareDocument)
        } as UserVerifyRequest;

        const result = await verifyClaims(userClaims, expoPushToken);
        setIsVerifying(false);
        result.success
          ? Alert.alert(
              AlertTitle.Success,
              "Your claims have been successfully verified"
            )
          : Alert.alert(AlertTitle.Error, result.message);
      } catch (error: any) {
        setIsVerifying(false);
        Alert.alert(AlertTitle.Error, error.message);
      }
    }
  };

  return (
    <View style={commonStyles.screen}>
      <StatusBar hidden={false} />
      <UserDetailsHeader />
      <CreateMnemonicController />
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={commonStyles.text.smallHeading}>Your Claims</Text>
          {usersClaims.length ? (
            <ClaimsList
              claims={usersClaims.filter((c) => !c.hideFromList)}
              onPress={navigateToClaim}
            />
          ) : (
            <View>
              <Text style={styles.emptyClaimsText}>
                You don't have have any claims yet. Get started by verifying a
                claim below.
              </Text>
            </View>
          )}
          {unclaimedClaims.length ? (
            <>
              <Text style={commonStyles.text.smallHeading}>All Claims</Text>
              <ClaimsList
                claims={unclaimedClaims.filter((c) => !c.hideFromList)}
                onPress={navigateToClaim}
              />
            </>
          ) : null}
          {/* <BottomNavBarSpacer /> */}
        </ScrollView>
        <View style={styles.buttonWrapper}>
          {!canVerify && (
            <Text style={styles.verifyText}>
              Complete your Name, DOB and Email claims and attach Medicare and
              Licence documents to verify
            </Text>
          )}
          <IdemButton
            title="Verify My Claims"
            loading={isVerifying}
            disabled={!canVerify || hasVerified}
            onPress={verifyUserOnProxy}
          />
        </View>
      </View>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  emptyClaimsText: {
    marginBottom: 10
  },
  buttonWrapper: {
    alignSelf: "stretch",
    marginBottom: 20
  },
  verifyText: {
    marginHorizontal: 15,
    marginBottom: 10,
    fontSize: 12
  },
  container: {
    ...commonStyles.screenContent,
    flex: 1,
    justifyContent: "space-between"
  },
  scrollContainer: {
    flex: 1
  }
});
