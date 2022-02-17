import React from "react";
import PropTypes from "prop-types";
import { View, SafeAreaView, Text } from "react-native";

import { DrawerActions } from "@react-navigation/native";
import FontIcon from "react-native-vector-icons/FontAwesome5";
import { colors } from "../styles/theme";

const DrawerMenu = (props: { navigation: any }) => (
  <SafeAreaView
    style={{ flex: 1, flexDirection: "column", paddingHorizontal: 10 }}
  >
    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      <FontIcon.Button
        name="times"
        size={20}
        color={colors.gray}
        backgroundColor="white"
        onPress={() => {
          props.navigation.dispatch(DrawerActions.closeDrawer());
        }}
      />
    </View>
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Drawer Menu</Text>
    </View>
  </SafeAreaView>
);

export default DrawerMenu;
