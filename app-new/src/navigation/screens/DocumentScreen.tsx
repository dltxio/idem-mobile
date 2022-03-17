import * as React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { Button, Input } from "react-native-elements";
import { Keyboard } from "react-native";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import commonStyles from "../../styles/styles";
import {
  ProfileStackNavigation,
  ProfileStackNavigationRoute
} from "../../types/navigation";
import { getDocumentFromDocumentId } from "../../utils/document-utils";
import { useClaimsStore } from "../../context/ClaimsStore";

type Navigation = ProfileStackNavigation<"Document">;

const DocumentScreen: React.FC = () => {
  const { onVerifyDocument } = useClaimsStore();
  const route = useRoute<ProfileStackNavigationRoute<"Document">>();
  const navigation = useNavigation<Navigation>();
  const document = getDocumentFromDocumentId(route.params.documentId);
  const [showDatePickerForFieldId, setShowDatePickerForFieldId] =
    React.useState<string>();
  let dateRefs = React.useRef<{ [key: string]: any }>({});
  const [formState, setFormState] = React.useState<{ [key: string]: string }>(
    {}
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  const showDatePickerFor = (fieldId: string) => {
    Keyboard.dismiss();
    dateRefs.current[fieldId].blur();
    setShowDatePickerForFieldId(fieldId);
  };

  const hideDatePicker = () => {
    setShowDatePickerForFieldId(undefined);
    Keyboard.dismiss();
  };

  const onDateSelect = (date: Date) => {
    if (showDatePickerForFieldId) {
      setFormState(previous => ({
        ...previous,
        [showDatePickerForFieldId]: moment(date).format("DD/MM/YYYY")
      }));
    }

    hideDatePicker();
  };

  const onSubmit = async () => {
    setLoading(true);
    await onVerifyDocument(document.id, formState);
    navigation.reset({
      routes: [{ name: "Home" }]
    });
    setLoading(false);
  };

  return (
    <ScrollView style={[commonStyles.screen, commonStyles.screenContent]}>
      {document.fields.map(field => {
        const onChange = (value: string) => {
          setFormState(previous => ({
            ...previous,
            [field.id]: value
          }));
        };

        if (field.type === "text") {
          return (
            <Input
              key={field.id}
              label={field.title}
              value={formState[field.id]}
              onChangeText={onChange}
              clearButtonMode="always"
            />
          );
        }

        if (field.type === "date") {
          return (
            <Input
              key={field.id}
              label={field.title}
              value={formState[field.id]}
              ref={ref =>
                (dateRefs.current = {
                  [field.id]: ref
                })
              }
              onFocus={() => showDatePickerFor(field.id)}
            />
          );
        }
      })}
      {showDatePickerForFieldId && (
        <DateTimePickerModal
          isVisible={true}
          mode="date"
          onConfirm={onDateSelect}
          onCancel={hideDatePicker}
        />
      )}
      <Button title="Verify" onPress={onSubmit} loading={loading} />
    </ScrollView>
  );
};

export default DocumentScreen;
