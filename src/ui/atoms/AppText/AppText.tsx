import React from "react";
import { Text, TextStyle } from "react-native";
import { AppTextProps } from "./AppText.interface";

const appTextVariantStyles: Record<AppTextProps["variant"], TextStyle> = {
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
    lineHeight: 36,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A2E",
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    color: "#3D3D5C",
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400",
    color: "#7A7A9D",
    lineHeight: 18,
  },
};

export default function AppText({
  variant,
  children,
  style,
}: AppTextProps): React.JSX.Element {
  return <Text style={[appTextVariantStyles[variant], style]}>{children}</Text>;
}
