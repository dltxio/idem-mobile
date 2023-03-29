import { View, StyleSheet, Text, Pressable, Alert } from "react-native";
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
import { ClaimTypeConstants, DocumentTypeConstants } from "../constants/common";
import useMnemonic from "../hooks/useMnemonic";
import { truncateAddress } from "../utils/wallet-utils";

type Navigation = ProfileStackNavigation<"Home">;

const UserDetailsHeader: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();
  const name = useClaimValue(ClaimTypeConstants.NameCredential);
  const email = useClaimValue(ClaimTypeConstants.EmailCredential);
  const profileImageId = useClaimValue(
    ClaimTypeConstants.ProfileImageCredential
  );
  const { ethAddress } = useMnemonic();
  const { selectPhotoFromCameraRoll } = useSelectPhoto(PROFILE_IMAGE_OPTIONS);
  const { addClaim } = useClaimsStore();
  const { addFile, files } = useDocumentStore();
  const profilePictureFile = files.find((file) => file.id === profileImageId);

  const addProfileImageClaim = async () => {
    const file = await selectPhotoFromCameraRoll();
    if (file.canceled) {
      return;
    }
    const fileId = await addFile(DocumentTypeConstants.ProfileImage, file.assets[0].uri);
    addClaim("ProfileImageCredential", { fileId }, []);
  };

  const showEthAddress = async () => {
    if (ethAddress) Alert.alert("Your eth address", ethAddress);
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
          onPress={() => navigation.navigate("NameClaim")}
        />
        <DetailOrPlaceholder
          value={email}
          placeholderWidth={150}
          onPress={() => navigation.navigate("EmailClaim")}
        />
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
