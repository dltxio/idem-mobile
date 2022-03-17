import { AntDesign } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import { Claim, ClaimType } from "../types/claim";

type PossiblyVerifiedClaim = Claim & { value?: string };

type Props = {
  claims: PossiblyVerifiedClaim[];
  onPress: (claimType: ClaimType) => void;
};

const ClaimsList: React.FC<Props> = ({ claims, onPress }) => {
  return (
    <View style={styles.claimsListWrapper}>
      {claims.map(claim => (
        <ClaimItem
          key={claim.key}
          claim={claim}
          onPress={() => onPress(claim.type)}
        />
      ))}
    </View>
  );
};

const ClaimItem: React.FC<{
  claim: PossiblyVerifiedClaim;
  onPress: () => void;
}> = ({ claim, onPress }) => {
  return (
    <ListItem key={claim.key} bottomDivider onPress={onPress}>
      <ListItem.Content>
        <ListItem.Title>{claim.title}</ListItem.Title>
        {claim.value && <ListItem.Subtitle>{claim.value}</ListItem.Subtitle>}
      </ListItem.Content>
      <AntDesign name="right" size={24} color="black" />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  claimsListWrapper: {
    marginBottom: 10
  },
  claimsHeaderText: {
    fontWeight: "500",
    fontSize: 18,
    marginBottom: 10
  }
});

export default ClaimsList;
