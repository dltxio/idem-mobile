import * as React from "react";
import { View, StyleSheet, Dimensions, StatusBar, Text } from "react-native";
import { ListItem } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { VendorStackNavigation } from "../../types/navigation";
import useVendorsList from "../../hooks/useVendorsList";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../styles/colors";

type Navigation = VendorStackNavigation<"Vendors">;

const VendorsScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { vendors } = useVendorsList();

  return (
    <View style={[styles.container, { marginTop: 20 }]}>
      <Text style={styles.headingText}>Supported Exchanges</Text>
      <StatusBar hidden={false} />
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
    fontSize: 17
  },

  tagLine: {
    textAlign: "left",
    fontSize: 15,
    justifyContent: "flex-start"
  },

  headingText: {
    right: 100,
    fontWeight: "500" as any,
    fontSize: 18,
    marginBottom: 10
  }
});
