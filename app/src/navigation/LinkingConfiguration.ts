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
        screens: {
          Back: "exchange/back",
          VendorDetails: "exchange/vendors"
        }
      },
      DocumentsTab: {
        screens: {
          Documents: "documents/documents",
          ViewFile: "documnets/file"
        }
      }
    }
  }
};

export default linking;
