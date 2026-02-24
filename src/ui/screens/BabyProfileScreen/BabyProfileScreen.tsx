import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@navigation/AppNavigator";
import { useOnboardingStore } from "@application/stores/useOnboardingStore";
import { useAppStore } from "@application/stores/useAppStore";
import OnboardingProgressBar from "@ui/molecules/OnboardingProgressBar/OnboardingProgressBar";
import BabyProfileForm from "@ui/organisms/BabyProfileForm/BabyProfileForm";
import AppText from "@ui/atoms/AppText/AppText";

type BabyProfileScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  "BabyProfile"
>;

export default function BabyProfileScreen({
  navigation,
}: BabyProfileScreenProps): React.JSX.Element {
  const babyName = useOnboardingStore((state) => state.babyName);
  const babyBirthDate = useOnboardingStore((state) => state.babyBirthDate);
  const babyGender = useOnboardingStore((state) => state.babyGender);
  const babyProfileFieldErrors = useOnboardingStore(
    (state) => state.babyProfileFieldErrors,
  );
  const saveBabyProfileStatus = useOnboardingStore(
    (state) => state.saveBabyProfileStatus,
  );
  const babyProfileErrorMessage = useOnboardingStore(
    (state) => state.babyProfileErrorMessage,
  );
  const setBabyName = useOnboardingStore((state) => state.setBabyName);
  const setBabyBirthDate = useOnboardingStore(
    (state) => state.setBabyBirthDate,
  );
  const setBabyGender = useOnboardingStore((state) => state.setBabyGender);
  const saveBabyProfile = useOnboardingStore((state) => state.saveBabyProfile);
  const setOnboardingComplete = useAppStore(
    (state) => state.setOnboardingComplete,
  );

  async function handleSubmit(): Promise<void> {
    await saveBabyProfile();
    const currentStatus = useOnboardingStore.getState().saveBabyProfileStatus;
    const currentError = useOnboardingStore.getState().babyProfileErrorMessage;
    if (currentStatus === "IDLE" && currentError === null) {
      setOnboardingComplete(true);
    }
  }

  return (
    <KeyboardAvoidingView
      style={babyProfileScreenStyles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={babyProfileScreenStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={babyProfileScreenStyles.container}>
          <OnboardingProgressBar currentStep={2} totalSteps={2} />

          <View style={babyProfileScreenStyles.headingContainer}>
            <AppText
              variant="heading"
              style={babyProfileScreenStyles.headingText}
            >
              Now, tell us about your baby
            </AppText>
            <AppText
              variant="body"
              style={babyProfileScreenStyles.subheadingText}
            >
              Step 2 of 2 — Baby details
            </AppText>
          </View>

          <BabyProfileForm
            babyName={babyName}
            birthDate={babyBirthDate}
            gender={babyGender}
            fieldErrors={babyProfileFieldErrors}
            saveStatus={saveBabyProfileStatus}
            onBabyNameChange={setBabyName}
            onBirthDateChange={setBabyBirthDate}
            onGenderChange={setBabyGender}
            onSubmit={handleSubmit}
          />

          {saveBabyProfileStatus === "ERROR" && babyProfileErrorMessage ? (
            <View style={babyProfileScreenStyles.errorBanner}>
              <AppText
                variant="caption"
                style={babyProfileScreenStyles.errorBannerText}
              >
                {babyProfileErrorMessage}
              </AppText>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const babyProfileScreenStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5FF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headingContainer: {
    marginTop: 28,
    marginBottom: 32,
  },
  headingText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  subheadingText: {
    color: "#8A8AA0",
  },
  errorBanner: {
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFCDD2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  errorBannerText: {
    color: "#C62828",
    textAlign: "center",
  },
});
