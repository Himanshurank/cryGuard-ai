export interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant: "primary" | "ghost" | "text";
  isLoading?: boolean;
  isDisabled?: boolean;
}
