import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@navigation/AppNavigator";
import { useOnboardingStore } from "@application/stores/useOnboardingStore";
import OnboardingProgressBar from "@ui/molecules/OnboardingProgressBar/OnboardingProgressBar";
import OnboardingForm from "@ui/organisms/OnboardingForm/OnboardingForm";
import AppText from "@ui/atoms/AppText/AppText";

type UserProfileScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  "UserProfile"
>;

export default function UserProfileScreen({
  navigation,
}: UserProfileScreenProps): React.JSX.Element {
  const userFirstName = useOnboardingStore((state) => state.userFirstName);
  const userLastName = useOnboardingStore((state) => state.userLastName);
  const userBirthDate = useOnboardingStore((state) => state.userBirthDate);
  const userMobile = useOnboardingStore((state) => state.userMobile);
  const userGender = useOnboardingStore((state) => state.userGender);
  const userProfileFieldErrors = useOnboardingStore(
    (state) => state.userProfileFieldErrors,
  );
  const saveUserProfileStatus = useOnboardingStore(
    (state) => state.saveUserProfileStatus,
  );
  const userProfileErrorMessage = useOnboardingStore(
    (state) => state.userProfileErrorMessage,
  );
  const setUserFirstName = useOnboardingStore(
    (state) => state.setUserFirstName,
  );
  const setUserLastName = useOnboardingStore((state) => state.setUserLastName);
  const setUserBirthDate = useOnboardingStore(
    (state) => state.setUserBirthDate,
  );
  const setUserMobile = useOnboardingStore((state) => state.setUserMobile);
  const setUserGender = useOnboardingStore((state) => state.setUserGender);
  const saveUserProfile = useOnboardingStore((state) => state.saveUserProfile);

  // Disable hardware back — user cannot return to SignUpScreen
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  // Navigate to BabyProfile on successful save
  useEffect(() => {
    if (saveUserProfileStatus === "IDLE" && userFirstName.length > 0) {
      // Only navigate after a successful save (status returns to IDLE from LOADING)
    }
  }, [saveUserProfileStatus, userFirstName]);

  async function handleSubmit(): Promise<void> {
    await saveUserProfile();
    // Navigate only if save succeeded (status is IDLE and no error)
    const currentStatus = useOnboardingStore.getState().saveUserProfileStatus;
    const currentError = useOnboardingStore.getState().userProfileErrorMessage;
    if (currentStatus === "IDLE" && currentError === null) {
      navigation.navigate("BabyProfile");
    }
  }

  return (
    <KeyboardAvoidingView
      style={userProfileScreenStyles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={userProfileScreenStyles.scrollContent}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={userProfileScreenStyles.container}>
          <OnboardingProgressBar currentStep={1} totalSteps={2} />

          <View style={userProfileScreenStyles.headingContainer}>
            <AppText
              variant="heading"
              style={userProfileScreenStyles.headingText}
            >
              Tell us about yourself
            </AppText>
            <AppText
              variant="body"
              style={userProfileScreenStyles.subheadingText}
            >
              Step 1 of 2 — Your details
            </AppText>
          </View>

          <OnboardingForm
            firstName={userFirstName}
            lastName={userLastName}
            birthDate={userBirthDate}
            mobile={userMobile}
            gender={userGender}
            fieldErrors={userProfileFieldErrors}
            saveStatus={saveUserProfileStatus}
            onFirstNameChange={setUserFirstName}
            onLastNameChange={setUserLastName}
            onBirthDateChange={setUserBirthDate}
            onMobileChange={setUserMobile}
            onGenderChange={setUserGender}
            onSubmit={handleSubmit}
          />

          {saveUserProfileStatus === "ERROR" && userProfileErrorMessage ? (
            <View style={userProfileScreenStyles.errorBanner}>
              <AppText
                variant="caption"
                style={userProfileScreenStyles.errorBannerText}
              >
                {userProfileErrorMessage}
              </AppText>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const userProfileScreenStyles = StyleSheet.create({
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
