import { TextStyle } from "react-native";

export interface AppTextProps {
  variant: "heading" | "subheading" | "body" | "caption";
  children: React.ReactNode;
  style?: TextStyle;
}
