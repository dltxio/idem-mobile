import * as React from "react";
import "react-native-get-random-values";
import "@ethersproject/shims";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TabNavigator from "./navigation/MainTabNavigator";
import { ClaimsProvider } from "./context/ClaimsStore";
import { useEffect } from "react";
import { ClaimRequest } from "./types/claim";
import { parseClaimRequest } from "./utils/claim-utils";
import { RequestClaimsModal } from "./components";
import { DocumentProvider } from "./context/DocumentStore";
import { MnemonicProvider } from "./context/Mnemonic";

const App = () => {
  const initialURL = Linking.useURL();
  const [newUrl, setNewUrl] = React.useState<boolean>(false);
  const [claimRequest, setClaimRequest] = React.useState<ClaimRequest>();

  useEffect(() => {
    Linking.addEventListener("url", ({ url }) => {
      if (url) {
        setNewUrl(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!initialURL) {
      return;
    }

    const { path, queryParams } = Linking.parse(initialURL);

    if (!path) {
      return;
    }

    if (newUrl) {
      setNewUrl(false);
    }

    if (path === "request-claims") {
      const request = parseClaimRequest(queryParams);

      if (request) {
        setClaimRequest(request);
      }
    }
  }, [initialURL, newUrl]);

  return (
    <SafeAreaProvider>
      <ClaimsProvider>
        <DocumentProvider>
          <MnemonicProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <TabNavigator />
              <RequestClaimsModal
                claimRequest={claimRequest}
                onClose={() => setClaimRequest(undefined)}
              />
            </NavigationContainer>
          </MnemonicProvider>
        </DocumentProvider>
      </ClaimsProvider>
    </SafeAreaProvider>
  );
};

export default App;
