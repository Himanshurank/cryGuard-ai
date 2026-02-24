import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppIconProps } from "@ui/atoms/AppIcon/AppIcon.interface";

export default function AppIcon({
  name,
  size = 24,
  color = "#1A1A2E",
}: AppIconProps): React.JSX.Element {
  return <Ionicons name={name as never} size={size} color={color} />;
}
