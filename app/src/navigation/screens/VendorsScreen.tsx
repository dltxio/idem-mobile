import * as React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { ListItem } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { VendorStackNavigation } from "../../types/navigation";
import useVendorsList from "../../hooks/useVendorsList";

type Navigation = VendorStackNavigation<"VendorsList">;

const VendorsScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { vendors } = useVendorsList();

  return (
    <View style={[styles.container, { marginTop: 70 }]}>
      <Text style={styles.header}>Supported Exchanges</Text>
      {vendors.length > 0 &&
        vendors.map((vendor) => {
          const content = (
            <>
              <ListItem.Content style={styles.container}>
                <ListItem.Title>{vendor.name}</ListItem.Title>
              </ListItem.Content>
            </>
          );

          return (
            <ListItem
              key={vendor.name}
              style={styles.container}
              onPress={() =>
                navigation.navigate("VendorDetails", {
                  vendorId: vendor.name
                })
              }
            >
              {content}
            </ListItem>
          );
        })}
    </View>
  );
};

export default VendorsScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width
  },

  header: {
    color: "black",
    fontSize: 30,
    marginBottom: 10
  }
});
