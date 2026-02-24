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
import LoginForm from "@ui/organisms/LoginForm/LoginForm";
import AppText from "@ui/atoms/AppText/AppText";

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({
  navigation,
}: LoginScreenProps): React.JSX.Element {
  const loginStatus = useAppStore((state) => state.loginStatus);
  const loginErrorMessage = useAppStore((state) => state.loginErrorMessage);
  const handleLoginSubmit = useAppStore((state) => state.handleLoginSubmit);

  return (
    <View style={loginScreenStyles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1040" />
      <KeyboardAvoidingView
        style={loginScreenStyles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={loginScreenStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top branding section */}
          <View style={loginScreenStyles.brandingSection}>
            <Image
              source={require("../../../../assets/logo.png")}
              style={loginScreenStyles.brandLogo}
              resizeMode="contain"
            />
            <AppText
              variant="subheading"
              style={loginScreenStyles.brandTagline}
            >
              Your baby's guardian angel
            </AppText>
          </View>

          {/* Bottom form card */}
          <View style={loginScreenStyles.formCard}>
            <LoginForm
              loginStatus={loginStatus}
              errorMessage={loginErrorMessage}
              onLoginSubmit={handleLoginSubmit}
              onNavigateToSignUp={() => navigation.navigate("SignUp")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const loginScreenStyles = StyleSheet.create({
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
