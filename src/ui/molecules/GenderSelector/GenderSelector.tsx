import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { GenderSelectorProps } from "@ui/molecules/GenderSelector/GenderSelector.interface";
import AppText from "@ui/atoms/AppText/AppText";

export default function GenderSelector({
  options,
  selectedValue,
  onSelect,
  errorMessage,
}: GenderSelectorProps): React.JSX.Element {
  return (
    <View style={genderSelectorStyles.container}>
      <View style={genderSelectorStyles.optionsRow}>
        {options.map((genderOption) => {
          const isSelected = genderOption.value === selectedValue;
          return (
            <TouchableOpacity
              key={genderOption.value}
              onPress={() => onSelect(genderOption.value)}
              activeOpacity={0.75}
              style={[
                genderSelectorStyles.optionButton,
                isSelected
                  ? genderSelectorStyles.optionButtonSelected
                  : genderSelectorStyles.optionButtonUnselected,
              ]}
            >
              <AppText
                variant="caption"
                style={[
                  genderSelectorStyles.optionLabel,
                  isSelected
                    ? genderSelectorStyles.optionLabelSelected
                    : undefined,
                ]}
              >
                {genderOption.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
      {errorMessage ? (
        <AppText variant="caption" style={genderSelectorStyles.errorText}>
          {errorMessage}
        </AppText>
      ) : null}
    </View>
  );
}

const genderSelectorStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  optionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  optionButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  optionButtonSelected: {
    backgroundColor: "#6C63FF",
    borderColor: "#6C63FF",
  },
  optionButtonUnselected: {
    backgroundColor: "#F8F8FF",
    borderColor: "#E8E8F0",
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8A8AA0",
    letterSpacing: 0.3,
  },
  optionLabelSelected: {
    color: "#FFFFFF",
  },
  errorText: {
    color: "#E53935",
    marginTop: 6,
    marginLeft: 4,
  },
});
