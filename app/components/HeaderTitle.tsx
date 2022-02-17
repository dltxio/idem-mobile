import React from "react";
import { Text } from "react-native";

const HeaderTitle = ({ title }: { title: string }) => (
  <Text
    style={{
      fontSize: 22,
      color: "black",
    }}
  >
    {title}
  </Text>
);

export default HeaderTitle;
