import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { AppButtonProps } from "@ui/atoms/AppButton/AppButton.interface";
import AppText from "@ui/atoms/AppText/AppText";

export default function AppButton({
  label,
  onPress,
  variant,
  isLoading = false,
  isDisabled = false,
}: AppButtonProps): React.JSX.Element {
  const isInteractionDisabled = isDisabled || isLoading;

  if (variant === "text") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isInteractionDisabled}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={
          isInteractionDisabled ? appButtonStyles.disabledState : undefined
        }
      >
        <AppText variant="body" style={appButtonStyles.textVariantLabel}>
          {label}
        </AppText>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isInteractionDisabled}
      activeOpacity={0.8}
      style={[
        appButtonStyles.base,
        variant === "primary"
          ? appButtonStyles.primaryVariant
          : appButtonStyles.ghostVariant,
        isInteractionDisabled && appButtonStyles.disabledState,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#FFFFFF" : "#6C63FF"}
          size="small"
        />
      ) : (
        <View
          style={
            variant === "primary" ? appButtonStyles.primaryInner : undefined
          }
        >
          <AppText
            variant="body"
            style={
              variant === "primary"
                ? appButtonStyles.primaryLabel
                : appButtonStyles.ghostLabel
            }
          >
            {label}
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const appButtonStyles = StyleSheet.create({
  base: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryVariant: {
    backgroundColor: "#6C63FF",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  ghostVariant: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#6C63FF",
  },
  disabledState: {
    opacity: 0.45,
  },
  primaryInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  primaryLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  ghostLabel: {
    color: "#6C63FF",
    fontWeight: "600",
    fontSize: 16,
  },
  textVariantLabel: {
    color: "#6C63FF",
    fontWeight: "600",
    fontSize: 15,
  },
});
