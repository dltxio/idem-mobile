import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import DocumentsStackNavigator from "./DocumentsStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import VendorsStackNavigator from "./VendorsStackNavigator";
import SettingsStackNavigator from "./SettingsStackNavigator";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import colors from "../styles/colors";

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Profile"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: tabProps => renderTabIcon(route, tabProps),
      tabBarActiveTintColor: colors.blue,
      tabBarInactiveTintColor: colors.gray
    })}
  >
    <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    <Tab.Screen name="3rd Parties" component={VendorsStackNavigator} />
    <Tab.Screen
      name="DocumentsTab"
      options={{
        title: "Documents"
      }}
      component={DocumentsStackNavigator}
    />
    <Tab.Screen
      name="SettingsTab"
      options={{
        title: "Settings"
      }}
      component={SettingsStackNavigator}
    />
  </Tab.Navigator>
);

export default TabNavigator;

const renderTabIcon = (
  routeProps: RouteProp<ParamListBase, string>,
  tabProps: {
    focused: boolean;
    color: string;
    size: number;
  }
) => {
  const iconFromRouteName: { [key: string]: string } = {
    Profile: "address-book",
    "3rd Parties": "university",
    DocumentsTab: "cog",
    Settings: "cog"
  };

  return (
    <FontAwesome5
      name={iconFromRouteName[routeProps.name] ?? "square"}
      color={tabProps.focused ? colors.blue : colors.gray}
      size={20}
      solid
    />
  );
};
