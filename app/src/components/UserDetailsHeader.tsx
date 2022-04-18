import { View, StyleSheet, Text } from "react-native";
import { useVerifiedClaimValue } from "../context/ClaimsStore";
import { Avatar } from "react-native-elements";
import colors from "../styles/colors";
import commonStyles from "../styles/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UserDetailsHeader: React.FC = () => {
  const insets = useSafeAreaInsets();
  const name = useVerifiedClaimValue("FullNameCredential");
  const email = useVerifiedClaimValue("EmailCredential");

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Avatar
        rounded
        size="large"
        source={{
          uri: "https://www.pngkit.com/png/detail/126-1262807_instagram-default-profile-picture-png.png"
        }}
      />
      <View style={styles.userDetails}>
        <DetailOrPlaceholder value={name} bold={true} placeholderWidth={90} />
        <DetailOrPlaceholder value={email} placeholderWidth={150} />
      </View>
    </View>
  );
};

const DetailOrPlaceholder: React.FC<{
  value: string | undefined;
  placeholderWidth: number;
  bold?: boolean;
}> = ({ value, placeholderWidth, bold }) => {
  if (!value) {
    return (
      <View
        style={[styles.userDetailPlaceholder, { width: placeholderWidth }]}
      />
    );
  }

  return <Text style={{ fontWeight: bold ? "bold" : undefined }}>{value}</Text>;
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 99,
    ...commonStyles.dropShadow
  },

  userDetails: {
    marginLeft: 10
  },
  userDetailPlaceholder: {
    height: 10,
    width: 90,
    backgroundColor: "grey",
    marginTop: 3
  }
});

export default UserDetailsHeader;
