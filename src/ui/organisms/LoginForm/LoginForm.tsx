import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { LoginFormProps } from "@ui/organisms/LoginForm/LoginForm.interface";
import AppText from "@ui/atoms/AppText/AppText";
import AppTextInput from "@ui/atoms/AppTextInput/AppTextInput";
import AppButton from "@ui/atoms/AppButton/AppButton";

export default function LoginForm({
  loginStatus,
  errorMessage,
  onLoginSubmit,
  onNavigateToSignUp,
}: LoginFormProps): React.JSX.Element {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");

  const isSubmitting = loginStatus === "LOADING";

  function handleSubmitPress(): void {
    onLoginSubmit(emailInputValue, passwordInputValue);
  }

  return (
    <View style={loginFormStyles.container}>
      <AppText variant="heading" style={loginFormStyles.headingText}>
        Welcome back
      </AppText>
      <AppText variant="body" style={loginFormStyles.subheadingText}>
        Sign in to continue monitoring
      </AppText>

      <View style={loginFormStyles.fieldsContainer}>
        <View style={loginFormStyles.fieldGroup}>
          <AppText variant="caption" style={loginFormStyles.fieldLabel}>
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

        <View style={loginFormStyles.fieldGroup}>
          <AppText variant="caption" style={loginFormStyles.fieldLabel}>
            PASSWORD
          </AppText>
          <AppTextInput
            value={passwordInputValue}
            onChangeText={setPasswordInputValue}
            placeholder="Enter your password"
            secureTextEntry
            editable={!isSubmitting}
          />
        </View>
      </View>

      {loginStatus === "ERROR" && errorMessage ? (
        <View style={loginFormStyles.errorBanner}>
          <AppText variant="caption" style={loginFormStyles.errorBannerText}>
            {errorMessage}
          </AppText>
        </View>
      ) : null}

      <View style={loginFormStyles.submitButtonContainer}>
        <AppButton
          label="Sign In"
          onPress={handleSubmitPress}
          variant="primary"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        />
      </View>

      <View style={loginFormStyles.signUpRow}>
        <AppText variant="body" style={loginFormStyles.signUpPromptText}>
          Don't have an account?{" "}
        </AppText>
        <AppButton
          label="Sign Up"
          onPress={onNavigateToSignUp}
          variant="text"
          isDisabled={isSubmitting}
        />
      </View>
    </View>
  );
}

const loginFormStyles = StyleSheet.create({
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
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpPromptText: {
    color: "#8A8AA0",
    fontSize: 15,
  },
});
