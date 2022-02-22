import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { imageAssets } from "./styles/theme/images";
import { fontAssets } from "./styles/theme/fonts";
import navRef from "./navigation/navRef";
import { NavigationContainer } from "@react-navigation/native";
import { Asset } from "expo-asset";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { RootStoreProvider } from "./store/rootStore";
import { StatusBar } from "expo-status-bar";
import { ClaimProvider } from "./providers/Claim";

export type Screens = "Info" | "ClaimRequest";

const App = () => {
  const [didLoad, setDidLoad] = useState(false);
  const handleLoadAssets = async () => {
    // Asset preloading.
    await Promise.all<void | Asset>([...imageAssets, ...fontAssets]);
    setDidLoad(true);
  };

  useEffect(() => {
    handleLoadAssets();
  }, []);

  if (!didLoad) return <View />;

  return (
    <RootStoreProvider>
      <StatusBar style="auto" />
      <NavigationContainer ref={navRef}>
        <ClaimProvider>
          <DrawerNavigator />
        </ClaimProvider>
      </NavigationContainer>
    </RootStoreProvider>
  );
};

export default App;
