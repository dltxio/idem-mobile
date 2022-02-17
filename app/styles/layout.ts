import { Dimensions, Platform } from "react-native";

const { height, width } = Dimensions.get("window");
const device = Platform.OS;

export default {
  window: {
    width,
    height,
  },
  device,
};
