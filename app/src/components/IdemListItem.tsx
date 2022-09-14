import { AntDesign } from "@expo/vector-icons";
import { ListItem } from "@rneui/themed";

type Props = {
  title: string;
  onPress: () => void;
  subtitle?: string;
};

const IdemListItem: React.FC<Props> = ({ title, subtitle, onPress }) => {
  return (
    <ListItem bottomDivider onPress={onPress}>
      <ListItem.Content>
        <ListItem.Title>{title}</ListItem.Title>
        {subtitle && <ListItem.Subtitle>{subtitle}</ListItem.Subtitle>}
      </ListItem.Content>
      <AntDesign name="right" size={24} color="black" />
    </ListItem>
  );
};

export default IdemListItem;
