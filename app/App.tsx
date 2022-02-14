import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import Info from "./screens/Info/Info";
import ClaimRequest from "./screens/ClaimRequest/ClaimRequest";
import * as Linking from "expo-linking";

export type Screens = "Info" | "ClaimRequest";

const App = () => {
  const [screen, setScreen] = useState<Screens>("Info");
  const [claimRequestData, setClaimRequestData] =
    useState<{
      claims: string; // A json stringified array of numbers
      callback: string; // base 64 encoded url
      nonce: string;
    } | null>(null);
  Linking.addEventListener("url", (event) => {
    const data = Linking.parse(event.url);
    if (
      !data.queryParams.claims ||
      !data.queryParams.nonce ||
      !data.queryParams.callback
    )
      return;
    if (data.queryParams) {
      setClaimRequestData(data.queryParams);
      setScreen("ClaimRequest");
    }
  });

  return (
    <View style={{ flex: 1 }}>
      {/* <Text style={{ margin: 50 }}>{JSON.stringify(claimRequestData)}</Text> */}
      {screen === "Info" && <Info />}
      {screen === "ClaimRequest" && claimRequestData && (
        <ClaimRequest setScreen={setScreen} claimData={claimRequestData} />
      )}
    </View>
  );
};

export default App;
