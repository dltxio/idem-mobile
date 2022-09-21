import { ScrollView, View, StatusBar } from "react-native";
import ClaimScreenStyles from "../../../styles/ClaimScreenStyles";
import commonStyles from "../../../styles/styles";
import { getClaimFromType } from "../../../utils/claim-utils";
import { ClaimTypeConstants } from "../../../constants/common";
import { useClaimsStore } from "../../../context/ClaimsStore";
import { Input } from "@rneui/themed";
import React from "react";
import { FormState } from "../../../types/claim";
import { Button } from "@rneui/base";
import useBaseClaim from "../../../hooks/useBaseClaim";
import { ProfileStackNavigation } from "../../../types/navigation";
import { useNavigation } from "@react-navigation/native";

type Navigation = ProfileStackNavigation<"NameClaim">;

const NameClaimScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const claim = getClaimFromType(ClaimTypeConstants.NameCredential);
  const { usersClaims } = useClaimsStore();
  const userClaim = usersClaims.find((c) => c.type === claim.type);
  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );
  const canSave = formState["firstName"] && formState["lastName"];
  const { loading, onSave } = useBaseClaim();
  return (
    <View style={commonStyles.screen}>
      <ScrollView style={commonStyles.screenContent}>
        <View style={ClaimScreenStyles.content}>
          <StatusBar hidden={false} />

          {claim.fields.map((field) => {
            const onChange = (value: string) => {
              setFormState((previous) => ({
                ...previous,
                [field.id]: value
              }));
            };
            return (
              <View key={field.id}>
                <Input
                  label={field.title}
                  clearButtonMode="always"
                  autoCapitalize="none"
                  value={formState[field.id] as string}
                  onChangeText={onChange}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={ClaimScreenStyles.buttonWrapper}>
        <Button
          title={"Save"}
          loading={loading}
          onPress={() => onSave(formState, claim.type, navigation)}
          disabled={!canSave}
        />
      </View>
    </View>
  );
};

export default NameClaimScreen;
