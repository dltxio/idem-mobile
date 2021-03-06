import { View, StyleSheet, Text, Alert, Pressable } from "react-native";
import { useClaimsStore, useClaimValue } from "../context/ClaimsStore";
import { Avatar } from "@rneui/themed";
import colors from "../styles/colors";
import commonStyles from "../styles/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSelectPhoto from "../hooks/useSelectPhoto";
import { PROFILE_IMAGE_OPTIONS } from "../utils/image-utils";
import { useDocumentStore } from "../context/DocumentStore";
import { useNavigation } from "@react-navigation/native";
import { ProfileStackNavigation } from "../types/navigation";
import defaultProfilePicture from "../../assets/default-profile-picture.png";
import { truncateAddress } from "../utils/wallet-utils";
import useMnemonic from "../hooks/useMnemonic";

type Navigation = ProfileStackNavigation<"Home">;

const UserDetailsHeader: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();
  const name = useClaimValue("NameCredential");
  const email = useClaimValue("EmailCredential");
  const profileImageId = useClaimValue("ProfileImageCredential");

  const { selectPhotoFromCameraRoll } = useSelectPhoto(PROFILE_IMAGE_OPTIONS);
  const { addClaim } = useClaimsStore();
  const { addFile, files } = useDocumentStore();

  const { ethAddress } = useMnemonic();

  const profilePictureFile = files.find((file) => file.id === profileImageId);

  const addProfileImageClaim = async () => {
    const file = await selectPhotoFromCameraRoll();
    if (file.cancelled) {
      return;
    }
    const fileId = await addFile("profile-image", file.uri);
    addClaim("ProfileImageCredential", { fileId }, []);
  };

  const showEthAddress = async () => {
    Alert.alert("Your eth address", ethAddress);
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Avatar
        rounded
        size="large"
        source={
          profilePictureFile?.uri
            ? { uri: profilePictureFile?.uri }
            : defaultProfilePicture
        }
        onPress={addProfileImageClaim}
      />
      <View style={styles.userDetails}>
        <DetailOrPlaceholder
          value={name}
          bold={true}
          placeholderWidth={90}
          onPress={() =>
            navigation.navigate("Claim", { claimType: "NameCredential" })
          }
        />
        <DetailOrPlaceholder
          value={email}
          placeholderWidth={150}
          onPress={() =>
            navigation.navigate("Claim", { claimType: "EmailCredential" })
          }
        />
        <Text onPress={() => navigation.navigate("PGP")}>
          Import your PGP/GPG key pair
        </Text>
        <Text onPress={showEthAddress}>
          {ethAddress ? truncateAddress(ethAddress) : ""}
        </Text>
      </View>
    </View>
  );
};

const DetailOrPlaceholder: React.FC<{
  value: string | undefined;
  bold?: boolean;
  placeholderWidth: number;
  onPress: () => void;
}> = ({ value, placeholderWidth, bold, onPress }) => {
  if (!value) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.userDetailPlaceholder, { width: placeholderWidth }]}
      />
    );
  }

  return (
    <Text style={bold && styles.boldText} onPress={onPress}>
      {value}
    </Text>
  );
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
  },
  boldText: {
    fontWeight: "bold"
  }
});

export default UserDetailsHeader;
