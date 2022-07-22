import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { MainTabParamList } from "./MainTabNavigator";

const linking: LinkingOptions<MainTabParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      //Add screen
      Profile: {
        screens: {
          Home: "profile/home",
          PGP: "profile/pgp",
          Claim: "profile/claim"
        }
      },
      SupportedExchanges: {
        initialRouteName: "Vendors",
        screens: {
          Vendors: "exchange/vendors",
          VendorDetails: "exchange/vendors/:id"
        }
      },
      DocumentsTab: {
        screens: {
          Documents: "documents/documents",
          ViewFile: "documents/file"
        }
      }
    }
  }
};

export default linking;
