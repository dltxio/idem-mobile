import React from "react";
import FontIcon from "react-native-vector-icons/FontAwesome5";

const HeaderLeft = ({ navigation }: { navigation: any }) => {
  return (
    <>
      {navigation.canGoBack() && (
        <FontIcon.Button
          name="arrow-left"
          color="black"
          backgroundColor="white"
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            paddingLeft: 15,
          }}
        />
      )}
    </>
  );
};

export default HeaderLeft;
