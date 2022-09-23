import colors from "./colors";

export default {
  dropShadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  screen: {
    flex: 1,
    backgroundColor: colors.lightGrey
  },
  screenContent: {
    paddingTop: 20,
    paddingHorizontal: 20
  },
  text: {
    smallHeading: {
      fontWeight: "500" as any,
      fontSize: 18,
      marginBottom: 10,
      marginLeft: 10
    }
  }
};
