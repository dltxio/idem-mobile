import * as React from "react";
import { View } from "react-native";
import { Button } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useDocumentStore } from "../../context/DocumentStore";
import commonStyles from "../../styles/styles";

const VendorsScreen: React.FC = () => {
  const { reset: resetDocuments } = useDocumentStore();
  const { reset: resetClaims } = useClaimsStore();

  const onReset = () => {
    resetDocuments();
    resetClaims();
  };

  return (
    <View style={commonStyles.screen}>
      <Button title="Reset data" onPress={onReset} />
    </View>
  );
};

export default VendorsScreen;
