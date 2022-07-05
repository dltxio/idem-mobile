import * as React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { ListItem } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { VendorStackNavigation } from "../../types/navigation";
import useVendorsList from "../../hooks/useVendorsList";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../styles/colors";

type Navigation = VendorStackNavigation<"Back">;

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
              <ListItem.Content>
                <ListItem.Title style={styles.vendorName}>
                  {vendor.name}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.tagLine}>
                  {vendor.tagline}
                </ListItem.Subtitle>
              </ListItem.Content>
              <AntDesign name="right" style={styles.icon} />
            </>
          );

          return (
            <ListItem
              key={vendor.name}
              style={styles.container}
              onPress={() =>
                navigation.navigate("VendorDetails", {
                  id: vendor.id
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
    width: Dimensions.get("window").width,
    marginTop: 1
  },

  icon: {
    color: colors.black,
    fontSize: 24
  },

  header: {
    color: "black",
    fontSize: 40,
    marginBottom: 10
  },

  vendorName: {
    fontSize: 20
  },

  tagLine: {
    textAlign: "left",
    fontSize: 14,
    justifyContent: "flex-start"
  }
});
