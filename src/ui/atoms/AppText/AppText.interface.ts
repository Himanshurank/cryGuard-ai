import { StyleProp, TextStyle } from "react-native";

export interface AppTextProps {
  variant: "heading" | "subheading" | "body" | "caption";
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}
