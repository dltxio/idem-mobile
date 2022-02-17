import { FlexAlignType, FlexStyle, TextStyle } from "react-native";
import colors from "./theme/colors";

export default {
  root: {
    flex: 1,
    flexDirection: "column" as FlexStyle["direction"],
    alignItems: "center" as FlexAlignType,
    justifyContent: "center" as FlexAlignType,
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    marginTop: 16,
  },
  // todo - provide the type for window. Fixing build error.
  itemWrapper: (window: any) => ({
    paddingVertical: window.height * 0.03,
    paddingHorizontal: window.width * 0.1,
    borderBottomColor: "#cecece",
    borderBottomWidth: 1,
  }),
  itemName: {
    fontSize: 18,
    textAlign: "left" as TextStyle["textAlign"],
  },
};
