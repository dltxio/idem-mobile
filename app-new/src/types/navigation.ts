import { ParamListBase, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../navigation/ProfileStackNavigator";
import { DocumentsStackParamList } from "../navigation/DocumentsStackNavigator";

type StackNavigationNavigation<
  T extends ParamListBase,
  K extends keyof T
> = NativeStackNavigationProp<T, K>;

type Route<T extends ParamListBase, K extends keyof T> = RouteProp<T, K>;

export type ProfileStackNavigation<K extends keyof ProfileStackParamList> =
  StackNavigationNavigation<ProfileStackParamList, K>;

export type ProfileStackNavigationRoute<K extends keyof ProfileStackParamList> =
  Route<ProfileStackParamList, K>;

export type DocumentsStackNavigation<K extends keyof DocumentsStackParamList> =
  StackNavigationNavigation<DocumentsStackParamList, K>;

export type DocumentsStackNavigationRoute<
  K extends keyof DocumentsStackParamList
> = Route<DocumentsStackParamList, K>;
