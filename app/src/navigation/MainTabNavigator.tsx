import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import DocumentsStackNavigator from "./DocumentsStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import SettingsStackNavigator from "./screens/SettingsTabNavigator";
import VendorsStackNavigator, {
  PartnersStackParamList,
} from "./PartnersStackNavigator";
import {
  CommonActions,
  ParamListBase,
  PathConfig,
  RouteProp,
  useNavigation
} from "@react-navigation/native";
import colors from "../styles/colors";
import { MainTabNavigation } from "../types/navigation";
import { Linking } from "react-native";

export type MainTabParamList = {
  Profile: undefined;
  Partners:
    | undefined
    | { screen: string; params: PathConfig<PartnersStackParamList> };
  DocumentsTab: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type Navigation = MainTabNavigation<"Profile">;

const TabNavigator = () => {
  const navigation = useNavigation<Navigation>();

  useEffect(() => {
    Linking.addEventListener("url", ({ url }) => {
      if (url.includes("exchange/vendors")) {
        const [vendorId] = url.slice(-1);
        navigation.dispatch(
          CommonActions.reset({
            type: "tab",
            index: 0,
            routes: [
              {
                name: "Partners",
                state: {
                  type: "stack",
                  index: 1,
                  routes: [
                    {
                      name: "Vendors"
                    },
                    {
                      name: "VendorDetails",
                      params: {
                        id: vendorId
                      }
                    }
                  ]
                }
              }
            ]
          })
        );
      }
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: (tabProps) => renderTabIcon(route, tabProps),
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.gray
      })}
    >
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />

      <Tab.Screen
        name="Partners"
        component={VendorsStackNavigator}
        options={{ title: "Partners" }}
      />
      <Tab.Screen
        name="DocumentsTab"
        options={{
          title: "Documents"
        }}
        component={DocumentsStackNavigator}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{ title: "Settings" }}
      />
    </Tab.Navigator>
  );
};

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
    SupportedExchanges: "university",
    DocumentsTab: "cog",
    Settings: "bars"
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
