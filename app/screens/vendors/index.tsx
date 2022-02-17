import React, { useEffect } from "react";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import styles from "../../styles";
import { useNavigation } from "@react-navigation/core";
import { useRootStore } from "../../store/rootStore";
import { observer } from "mobx-react-lite";

type VenderItemProps = {
  onPress: () => void;
  name: string;
  url: string;
};

const VendorListItem = ({ onPress, name, url }: VenderItemProps) => (
  <TouchableOpacity
    style={styles.list.itemWrapper(styles.layout.window)}
    onPress={onPress}
  >
    <Text style={styles.list.itemName}>{name}</Text>
    <Text style={{ color: "#707070" }}>{url}</Text>
  </TouchableOpacity>
);

const VendorSelector = () => {
  const navigation = useNavigation();
  const rootStore = useRootStore();
  const vendors = rootStore.Assets.vendors;

  useEffect(() => {
    rootStore.Assets.loadVendors();
  }, []);

  if (vendors == null)
    return (
      <View style={styles.list.root as ViewStyle}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.list.root as ViewStyle}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, width: "100%" }}>
        {vendors.map((item) => {
          return (
            <VendorListItem
              key={item.url}
              onPress={() => {
                rootStore.Assets.setVendorKey(item.key);
                navigation.navigate("Vendor");
              }}
              name={item.name}
              url={item.url}
            />
          );
        })}
      </View>
    </View>
  );
};

export default observer(VendorSelector);
