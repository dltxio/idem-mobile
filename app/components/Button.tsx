import React from "react";
import { TouchableOpacity, Text, TextStyle, ViewStyle } from "react-native";

type ButtonProps = {
  title?: string;
  width?: string;
  height?: string;
  disabled?: boolean;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
  children?: string;
  textStyle?: TextStyle;
  style?: ViewStyle;
};

const Button = ({
  title,
  width,
  height,
  disabled,
  color,
  backgroundColor,
  onPress,
  children,
  textStyle,
  style,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        width: width || "auto",
        height: height || "auto",
        backgroundColor: backgroundColor || "#cacaca",
        ...style,
      }}
    >
      {title && (
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            color: color || "black",
            ...textStyle,
          }}
        >
          {title}
        </Text>
      )}
      {children}
    </TouchableOpacity>
  );
};

export default Button;
