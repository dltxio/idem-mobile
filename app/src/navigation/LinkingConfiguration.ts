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
      Partners: {
        initialRouteName: "Partners",
        screens: {
          Partners: "exchange/partners",
          PartnerDetails: "exchange/partners/:id"
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
