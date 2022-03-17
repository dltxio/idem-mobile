import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TabNavigator from "./navigation/MainTabNavigator";
import { ClaimsProvider } from "./context/ClaimsStore";

const App = () => {
  return (
    <SafeAreaProvider>
      <ClaimsProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <TabNavigator />
        </NavigationContainer>
      </ClaimsProvider>
    </SafeAreaProvider>
  );
};

registerRootComponent(App);
