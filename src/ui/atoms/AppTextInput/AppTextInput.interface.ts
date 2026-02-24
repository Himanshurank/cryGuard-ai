import { KeyboardTypeOptions, StyleProp, TextStyle } from "react-native";

export interface AppTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  errorMessage?: string | null;
  editable?: boolean;
  style?: StyleProp<TextStyle>;
}
