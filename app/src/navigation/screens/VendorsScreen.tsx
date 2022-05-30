import * as React from "react";
import { View, Alert } from "react-native";
import { Button } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useDocumentStore } from "../../context/DocumentStore";
import commonStyles from "../../styles/styles";

const VendorsScreen: React.FC = () => {
  const { reset: resetDocuments } = useDocumentStore();
  const { reset: resetClaims } = useClaimsStore();

  const showAlert = () =>
  Alert.alert(
    "CAUTION",
    "You are about to reset your data, including claims and files. Would you like to continue?",
    [
      {
        text: "OK",
        onPress: onReset,
        style: "destructive",
      },
      {
        text: "Cancel",
        onPress: () => Alert.alert("Cancel Pressed"),
        style: "cancel",
      },
    ],
    {
      cancelable: true,
    }
  );

  const onReset = () => {
    resetDocuments();
    resetClaims();
  };

  return (
    <View style={commonStyles.screen}>
      <Button title="Reset data" onPress={showAlert} />
    </View>
  );
};

export default VendorsScreen;
