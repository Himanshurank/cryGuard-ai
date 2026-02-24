import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusIndicatorProps } from "./StatusIndicator.interface";

const statusColourMap: Record<string, string> = {
  GRANTED: "#4CAF50",
  DENIED: "#E53935",
  PENDING: "#B0B0C0",
};

export default function StatusIndicator({
  status,
  size = 12,
}: StatusIndicatorProps): React.JSX.Element {
  return (
    <View
      style={[
        statusIndicatorStyles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: statusColourMap[status],
        },
      ]}
    />
  );
}

const statusIndicatorStyles = StyleSheet.create({
  circle: {
    flexShrink: 0,
  },
});
