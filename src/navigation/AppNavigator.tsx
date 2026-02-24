import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppStore } from "@application/stores/useAppStore";
import SplashScreen from "@ui/screens/SplashScreen/SplashScreen";
import LoginScreen from "@ui/screens/LoginScreen/LoginScreen";

// Stack param lists
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type OnboardingStackParamList = {
  UserProfile: undefined;
  BabyProfile: undefined;
};

export type AppStackParamList = {
  RoleSelection: undefined;
  Permissions: undefined;
  BabyStation: undefined;
  ParentStation: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

// Screens are imported here as they are built, screen by screen.
// Placeholder components are used until each screen is implemented.
const PlaceholderScreen = () => null;

function AuthNavigator(): React.JSX.Element {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={PlaceholderScreen} />
    </AuthStack.Navigator>
  );
}

function OnboardingNavigator(): React.JSX.Element {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen
        name="UserProfile"
        component={PlaceholderScreen}
      />
      <OnboardingStack.Screen
        name="BabyProfile"
        component={PlaceholderScreen}
      />
    </OnboardingStack.Navigator>
  );
}

function MainAppNavigator(): React.JSX.Element {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="RoleSelection" component={PlaceholderScreen} />
      <AppStack.Screen name="Permissions" component={PlaceholderScreen} />
      <AppStack.Screen name="BabyStation" component={PlaceholderScreen} />
      <AppStack.Screen name="ParentStation" component={PlaceholderScreen} />
    </AppStack.Navigator>
  );
}

export default function AppNavigator(): React.JSX.Element {
  const appInitialisationStatus = useAppStore(
    (state) => state.appInitialisationStatus,
  );
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isOnboardingComplete = useAppStore(
    (state) => state.isOnboardingComplete,
  );

  if (appInitialisationStatus === "LOADING") {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthNavigator />}
      {isAuthenticated && !isOnboardingComplete && <OnboardingNavigator />}
      {isAuthenticated && isOnboardingComplete && <MainAppNavigator />}
    </NavigationContainer>
  );
}
