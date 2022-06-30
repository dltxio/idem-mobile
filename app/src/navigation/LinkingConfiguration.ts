import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      //Add screen
      ExchangeDetail: "ExchangeDetail",
      Root: {
        screens: {
          Profile: "profile",
          Exchange: "exchange",
          Document: "Document"
        }
      }
    }
  }
};

export default linking;
