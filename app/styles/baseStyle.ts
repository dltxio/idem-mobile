import { StyleSheet, FlexStyle } from "react-native";

export default StyleSheet.create({
  viewPager: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "white",
  },
  viewPage: {
    paddingTop: 150,
    backgroundColor: "white",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  baseTextInput: {
    padding: 10,
    color: "black",
    margin: 10,
    borderColor: "#cecece",
    borderWidth: 1,
    borderRadius: 5,
  },
  dataPick: {
    padding: 10,
    color: "white",
    margin: 10,
    borderColor: "#cecece",
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
  },
  dataText: {
    color: "black",
    fontSize: 15,
    fontWeight: "500",
  },
  baseText: {
    color: "black",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 10,
  },
  baseTitle: { color: "black", fontSize: 20, fontWeight: "500" },
  baseButton: {
    height: 40,
    margin: 10,
  },
  errorMessage: {
    color: "red",
    fontSize: 15,
    fontWeight: "400",
    marginLeft: 10,
    marginBottom: 10,
  },
  innerView: {
    flexDirection: "row",
  },
});
