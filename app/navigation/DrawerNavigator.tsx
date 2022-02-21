import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import DrawerMenu from "../components/DrawerMenu";
import TabNavigator from "./MainTabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboard from "../screens/onboard";
import useClaims from "../hooks/useClaims";

const Drawer = createDrawerNavigator();

const DrawerMenuContainer = (props: DrawerContentComponentProps) => {
  const { state, ...rest } = props;
  const newState = { ...state };
  newState.routes = newState.routes.filter((item) => item.name !== "Home");
  return (
    <DrawerContentScrollView {...props}>
      <DrawerMenu {...props} />
      <DrawerItemList state={newState} {...rest} />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const { claims } = useClaims();

  return (
    <>
      {true ? (
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={DrawerMenuContainer}
        >
          <Drawer.Screen name="Home" component={TabNavigator} />
        </Drawer.Navigator>
      ) : (
        <Onboard />
      )}
    </>
  );
};

export default DrawerNavigator;
