import { Linking } from "react-native";

const register = async (vendor: any) => {
  Linking.openURL(vendor.url);
};

export default register;
