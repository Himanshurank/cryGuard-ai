import React, { useEffect } from "react";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@navigation/AppNavigator";
import { useAppStore } from "@application/stores/useAppStore";

type SplashScreenProps = NativeStackScreenProps<AuthStackParamList, "Splash">;

export default function SplashScreen({
  navigation,
}: SplashScreenProps): React.JSX.Element {
  const appInitialisationStatus = useAppStore(
    (state) => state.appInitialisationStatus,
  );
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const initializeAppSession = useAppStore(
    (state) => state.initializeAppSession,
  );

  useEffect(() => {
    initializeAppSession();
  }, [initializeAppSession]);

  useEffect(() => {
    if (appInitialisationStatus !== "COMPLETE") return;
    if (!isAuthenticated) {
      navigation.replace("Login");
    }
    // If authenticated, AppNavigator's state-driven routing handles the redirect
    // to OnboardingStack or AppStack automatically — no manual navigation needed.
  }, [appInitialisationStatus, isAuthenticated, navigation]);

  return (
    <View style={splashScreenStyles.container}>
      <Image
        source={require("../../../../assets/logo.png")}
        style={splashScreenStyles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator
        size="large"
        color="#6C63FF"
        style={splashScreenStyles.activityIndicator}
      />
    </View>
  );
}

const splashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
  activityIndicator: {
    marginTop: 32,
  },
});
