import { Dimensions, StyleSheet } from "react-native";

const ClaimScreenStyles = StyleSheet.create({
  content: { marginBottom: 10 },
  introText: {
    marginBottom: 10
  },
  buttonWrapper: {
    bottom: 0,
    width: Dimensions.get("window").width - 40,
    margin: 20
  },
  datePicker: {
    height: 500
  },
  mobileWarningText: {
    marginHorizontal: 10,
    marginBottom: 20
  }
});

export default ClaimScreenStyles;
