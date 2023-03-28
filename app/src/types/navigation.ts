import { ParamListBase, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../navigation/ProfileStackNavigator";
import { DocumentsStackParamList } from "../navigation/DocumentsStackNavigator";
import { PartnersStackParamList } from "../navigation/PartnersStackNavigator";
import { MainTabParamList } from "../navigation/MainTabNavigator";
import { SettingsStackParamList } from "../navigation/screens/SettingsTabNavigator";

type StackNavigationNavigation<
  T extends ParamListBase,
  K extends keyof T
> = NativeStackNavigationProp<T, K>;

type Route<T extends ParamListBase, K extends keyof T> = RouteProp<T, K>;

export type MainTabNavigation<K extends keyof MainTabParamList> =
  StackNavigationNavigation<MainTabParamList, K>;

export type ProfileStackNavigation<K extends keyof ProfileStackParamList> =
  StackNavigationNavigation<ProfileStackParamList, K>;

export type ProfileStackNavigationRoute<K extends keyof ProfileStackParamList> =
  Route<ProfileStackParamList, K>;

export type PartnersStackNavigaton<K extends keyof PartnersStackParamList> =
  StackNavigationNavigation<PartnersStackParamList, K>;

export type PartnersStackNavigationRoute<K extends keyof PartnersStackParamList> =
  Route<PartnersStackParamList, K>;

export type DocumentsStackNavigation<K extends keyof DocumentsStackParamList> =
  StackNavigationNavigation<DocumentsStackParamList, K>;

export type SettingsStackNavigation<K extends keyof SettingsStackParamList> =
  StackNavigationNavigation<SettingsStackParamList, K>;

export type DocumentsStackNavigationRoute<
  K extends keyof DocumentsStackParamList
> = Route<DocumentsStackParamList, K>;
