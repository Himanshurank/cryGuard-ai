import React from "react";
import { View, StyleSheet } from "react-native";
import { OnboardingProgressBarProps } from "@ui/molecules/OnboardingProgressBar/OnboardingProgressBar.interface";

export default function OnboardingProgressBar({
  currentStep,
  totalSteps,
}: OnboardingProgressBarProps): React.JSX.Element {
  return (
    <View style={onboardingProgressBarStyles.container}>
      {Array.from({ length: totalSteps }, (_, stepIndex) => (
        <View
          key={stepIndex}
          style={[
            onboardingProgressBarStyles.segment,
            stepIndex < currentStep
              ? onboardingProgressBarStyles.segmentFilled
              : onboardingProgressBarStyles.segmentEmpty,
            stepIndex < totalSteps - 1 &&
              onboardingProgressBarStyles.segmentGap,
          ]}
        />
      ))}
    </View>
  );
}

const onboardingProgressBarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 6,
  },
  segment: {
    flex: 1,
    borderRadius: 3,
  },
  segmentFilled: {
    backgroundColor: "#6C63FF",
  },
  segmentEmpty: {
    backgroundColor: "#E8E8F0",
  },
  segmentGap: {
    marginRight: 6,
  },
});
