import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@navigation/AppNavigator";
import { useAppStore } from "@application/stores/useAppStore";
import SignUpForm from "@ui/organisms/SignUpForm/SignUpForm";
import AppText from "@ui/atoms/AppText/AppText";

type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export default function SignUpScreen({
  navigation,
}: SignUpScreenProps): React.JSX.Element {
  const signUpStatus = useAppStore((state) => state.signUpStatus);
  const signUpErrorMessage = useAppStore((state) => state.signUpErrorMessage);
  const handleSignUpSubmit = useAppStore((state) => state.handleSignUpSubmit);

  return (
    <View style={signUpScreenStyles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1040" />
      <KeyboardAvoidingView
        style={signUpScreenStyles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={signUpScreenStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={signUpScreenStyles.brandingSection}>
            <Image
              source={require("../../../../assets/logo.png")}
              style={signUpScreenStyles.brandLogo}
              resizeMode="contain"
            />
            <AppText
              variant="subheading"
              style={signUpScreenStyles.brandTagline}
            >
              Your baby's guardian angel
            </AppText>
          </View>

          <View style={signUpScreenStyles.formCard}>
            <SignUpForm
              signUpStatus={signUpStatus}
              errorMessage={signUpErrorMessage}
              onSignUpSubmit={handleSignUpSubmit}
              onNavigateToLogin={() => navigation.navigate("Login")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const signUpScreenStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1A1040",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  brandingSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 32,
  },
  brandLogo: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  brandTagline: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 15,
    fontWeight: "400",
  },
  formCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
});
