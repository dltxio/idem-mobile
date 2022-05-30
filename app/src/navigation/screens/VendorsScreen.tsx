import * as React from "react";
import { View } from "react-native";
import { Button } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useDocumentStore } from "../../context/DocumentStore";
import commonStyles from "../../styles/styles";
import ResetDataModal from "./modals/ResetDataModal";

const VendorsScreen: React.FC = () => {
  const { reset: resetDocuments } = useDocumentStore();
  const { reset: resetClaims } = useClaimsStore();
  const [resetModal, setResetModal] = React.useState<boolean>(false);

  const onReset = () => {
    resetDocuments();
    resetClaims();
  };

  return (
    <View style={commonStyles.screen}>
      <ResetDataModal visible={resetModal} setVisible={setResetModal} onPress={onReset}/>
      <Button title="Reset data" onPress={() => setResetModal(true)} />
    </View>
  );
};

export default VendorsScreen;
