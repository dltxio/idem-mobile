import React from "react";
import { View, TextInput, ViewStyle } from "react-native";
import styles from "../../styles";
import { observer } from "mobx-react-lite";
import Button from "../../components/Button";
import { verifyClaim } from "../../helpers/claim/verify";
import useClaims from "../../hooks/useClaims";

const OtherClaim = ({
  item,
  uploadFileFromBrowser,
}: {
  item: server.Claim;
  uploadFileFromBrowser: () => void;
}) => {
  const { setClaim } = useClaims();
  const otherCredentialValue = item.credentialSubject.value;

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{
          ...styles.claim.input,
          width: styles.layout.window.width,
        }}
        value={value || ""}
        placeholder="Please enter your claim..."
        onChangeText={(value) => {
          setClaim(item.key, value);
        }}
      />
      <Button
        title="Add Supporting Document From Device"
        style={styles.claim.uploadButton as ViewStyle}
        onPress={uploadFileFromBrowser}
      />
      <Button
        title="Verify"
        style={styles.claim.verifyButton as ViewStyle}
        disabled={true}
        onPress={() => verifyClaim(item)}
      />
    </View>
  );
};

export default observer(OtherClaim);
