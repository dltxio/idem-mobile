import React, { useEffect } from "react";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useRootStore } from "../../store/rootStore";
import styles from "../../styles";
import { useNavigation } from "@react-navigation/core";
import { observer } from "mobx-react-lite";

type SettingItemProps = {
  onPress: () => void;
  key: string;
  name: string;
  description: string;
};

const SettingListItem = ({ onPress, name, description }: SettingItemProps) => (
  <TouchableOpacity
    style={styles.list.itemWrapper(styles.layout.window)}
    onPress={onPress}
  >
    <Text style={styles.list.itemName}>{name}</Text>
    <Text style={{ color: "#707070" }}>{description}</Text>
  </TouchableOpacity>
);

const SettingSelector = () => {
  const rootStore = useRootStore();
  const navigation = useNavigation();
  const settings = rootStore.Assets.settings;

  useEffect(() => {
    rootStore.Assets.loadSettings();
  }, []);

  if (settings === null) {
    return (
      <View style={styles.list.root as ViewStyle}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.list.root as ViewStyle}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, width: "100%" }}>
        {settings.map((setting) => {
          return (
            <SettingListItem
              key={setting.key}
              onPress={() => {
                rootStore.Assets.setSettingKey(setting.key);
                navigation.navigate("Setting");
              }}
              name={setting.name}
              description={setting.description}
            />
          );
        })}
      </View>
    </View>
  );
};

export default observer(SettingSelector);
