import * as React from "react";
import "react-native-get-random-values";
import "@ethersproject/shims";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TabNavigator from "./src/navigation/MainTabNavigator";
import { ClaimsProvider } from "./src/context/ClaimsStore";
import { useEffect } from "react";
import { ClaimRequest } from "./src/types/claim";
import { parseClaimRequest } from "./src/utils/claim-utils";
import RequestClaimsModal from "./src/components/RequestClaimsModal";
import { DocumentProvider } from "./src/context/DocumentStore";
import { MnemonicProvider } from "./src/context/Mnemonic";
import { ExchangeProvider } from "./src/context/Exchange";
import * as Notifications from "expo-notifications";
import LinkingConfiguration from "./src/navigation/LinkingConfiguration";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

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

    if (path === "request-claims" && queryParams) {
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
            <ExchangeProvider>
              <NavigationContainer linking={LinkingConfiguration}>
                <StatusBar style="auto" />
                <TabNavigator />
                <RequestClaimsModal
                  claimRequest={claimRequest}
                  onClose={() => setClaimRequest(undefined)}
                />
              </NavigationContainer>
            </ExchangeProvider>
          </MnemonicProvider>
        </DocumentProvider>
      </ClaimsProvider>
    </SafeAreaProvider>
  );
};

export default App;
