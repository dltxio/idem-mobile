import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import Info from "./screens/Info/Info";
import ClaimRequest from './screens/ClaimRequest/ClaimRequest';
import * as Linking from 'expo-linking';
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
  // const [screen, setScreen] = useState<Screens>("Info");
  // const [claimRequestData, setClaimRequestData] = useState<{
  //   claims: string, // A json stringified array of numbers
  //   callback: string, // base 64 encoded url
  //   nonce: string
  // } | null>(null);
  // Linking.addEventListener('url', (event) => {
  //   const data = Linking.parse(event.url);
  //   if (!data.queryParams.claims || !data.queryParams.nonce || !data.queryParams.callback) return;
  //   if (data.queryParams) {
  //     setClaimRequestData(data.queryParams);
  //     setScreen("ClaimRequest");
  //   }
  // })

  // return (
  //   <View style={{ flex: 1 }}>
  //     {/* <Text style={{ margin: 50 }}>{JSON.stringify(claimRequestData)}</Text> */}
  //     {screen === "Info" && <Info />}
  //     {screen === "ClaimRequest" && claimRequestData && <ClaimRequest setScreen={setScreen} claimData={claimRequestData} />}
  //   </View>
  // );
  );
};

export default App;
