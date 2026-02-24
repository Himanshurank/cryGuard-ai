import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SignUpFormProps } from "@ui/organisms/SignUpForm/SignUpForm.interface";
import AppText from "@ui/atoms/AppText/AppText";
import AppTextInput from "@ui/atoms/AppTextInput/AppTextInput";
import AppButton from "@ui/atoms/AppButton/AppButton";

export default function SignUpForm({
  signUpStatus,
  errorMessage,
  onSignUpSubmit,
  onNavigateToLogin,
}: SignUpFormProps): React.JSX.Element {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [confirmPasswordInputValue, setConfirmPasswordInputValue] =
    useState("");
  const [passwordMismatchError, setPasswordMismatchError] = useState<
    string | null
  >(null);

  const isSubmitting = signUpStatus === "LOADING";

  function handleSubmitPress(): void {
    if (passwordInputValue !== confirmPasswordInputValue) {
      setPasswordMismatchError("Passwords do not match.");
      return;
    }
    setPasswordMismatchError(null);
    onSignUpSubmit(emailInputValue, passwordInputValue);
  }

  function handleConfirmPasswordChange(text: string): void {
    setConfirmPasswordInputValue(text);
    if (passwordMismatchError && text === passwordInputValue) {
      setPasswordMismatchError(null);
    }
  }

  return (
    <View style={signUpFormStyles.container}>
      <AppText variant="heading" style={signUpFormStyles.headingText}>
        Create account
      </AppText>
      <AppText variant="body" style={signUpFormStyles.subheadingText}>
        Set up CryGuard for your family
      </AppText>

      <View style={signUpFormStyles.fieldsContainer}>
        <View style={signUpFormStyles.fieldGroup}>
          <AppText variant="caption" style={signUpFormStyles.fieldLabel}>
            EMAIL ADDRESS
          </AppText>
          <AppTextInput
            value={emailInputValue}
            onChangeText={setEmailInputValue}
            placeholder="you@example.com"
            keyboardType="email-address"
            editable={!isSubmitting}
          />
        </View>

        <View style={signUpFormStyles.fieldGroup}>
          <AppText variant="caption" style={signUpFormStyles.fieldLabel}>
            PASSWORD
          </AppText>
          <AppTextInput
            value={passwordInputValue}
            onChangeText={setPasswordInputValue}
            placeholder="Create a password"
            secureTextEntry
            editable={!isSubmitting}
          />
        </View>

        <View style={signUpFormStyles.fieldGroup}>
          <AppText variant="caption" style={signUpFormStyles.fieldLabel}>
            CONFIRM PASSWORD
          </AppText>
          <AppTextInput
            value={confirmPasswordInputValue}
            onChangeText={handleConfirmPasswordChange}
            placeholder="Repeat your password"
            secureTextEntry
            editable={!isSubmitting}
            errorMessage={passwordMismatchError}
          />
        </View>
      </View>

      {signUpStatus === "ERROR" && errorMessage ? (
        <View style={signUpFormStyles.errorBanner}>
          <AppText variant="caption" style={signUpFormStyles.errorBannerText}>
            {errorMessage}
          </AppText>
        </View>
      ) : null}

      <View style={signUpFormStyles.submitButtonContainer}>
        <AppButton
          label="Create Account"
          onPress={handleSubmitPress}
          variant="primary"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        />
      </View>

      <View style={signUpFormStyles.loginRow}>
        <AppText variant="body" style={signUpFormStyles.loginPromptText}>
          Already have an account?{" "}
        </AppText>
        <AppButton
          label="Sign In"
          onPress={onNavigateToLogin}
          variant="text"
          isDisabled={isSubmitting}
        />
      </View>
    </View>
  );
}

const signUpFormStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headingText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  subheadingText: {
    color: "#8A8AA0",
    marginBottom: 36,
  },
  fieldsContainer: {
    gap: 20,
    marginBottom: 8,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8A8AA0",
    letterSpacing: 1.2,
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
  submitButtonContainer: {
    marginTop: 28,
    marginBottom: 20,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginPromptText: {
    color: "#8A8AA0",
    fontSize: 15,
  },
});
