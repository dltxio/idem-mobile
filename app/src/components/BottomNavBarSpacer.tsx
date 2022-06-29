import * as React from "react";
import { View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const BottomNavBarSpacer: React.FC = ({
  children
}: React.PropsWithChildren) => {
  const navBarHeight = useBottomTabBarHeight();
  return <View style={{ marginBottom: navBarHeight }}>{children}</View>;
};

export default BottomNavBarSpacer;
