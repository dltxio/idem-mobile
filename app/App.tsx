import * as React from "react";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
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
import * as Notifications from "expo-notifications";
import * as Sentry from "sentry-expo";
import LinkingConfiguration from "./src/navigation/LinkingConfiguration";
import { ApiProvider } from "./providers/Api";
import config from "./config";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

Sentry.init({
  dsn: config.sentryDSN,
  debug: config.sentryDebugEnable,
  environment: config.releaseChannel
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

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const url = response.notification.request.content.data.url as string;
        await Linking.openURL(url);
      }
    );
    return () => subscription.remove();
  });

  return (
    <SafeAreaProvider>
      <ApiProvider>
        <ClaimsProvider>
          <DocumentProvider>
            <ActionSheetProvider>
              <NavigationContainer linking={LinkingConfiguration}>
                <StatusBar style="auto" />
                <TabNavigator />
                <RequestClaimsModal
                  claimRequest={claimRequest}
                  onClose={() => setClaimRequest(undefined)}
                />
              </NavigationContainer>
            </ActionSheetProvider>
          </DocumentProvider>
        </ClaimsProvider>
      </ApiProvider>
    </SafeAreaProvider>
  );
};

export default App;
