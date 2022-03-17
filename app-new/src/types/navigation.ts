import {
  ParamListBase,
  RouteProp
  // Route as RouteReactNavigation
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../navigation/ProfileStackNavigator";

type StackNavigationNavigation<
  T extends ParamListBase,
  K extends keyof T
> = NativeStackNavigationProp<T, K>;

type Route<T extends ParamListBase, K extends keyof T> = RouteProp<T, K>;

export type ProfileStackNavigation<K extends keyof ProfileStackParamList> =
  StackNavigationNavigation<ProfileStackParamList, K>;

export type ProfileStackNavigationRoute<K extends keyof ProfileStackParamList> =
  Route<ProfileStackParamList, K>;
