import { create } from "zustand";
import { Linking, Platform } from "react-native";
import { EAppRole } from "@core/enums/AppRole";
import { EPermissionStatus } from "@core/enums/PermissionStatus";
import { UserProfile } from "@core/entities/UserProfile";
import { BabyProfile } from "@core/entities/BabyProfile";
import { applicationContainer } from "@config/container/ServiceContainer";
import ServiceTokens from "@config/serviceTokens";
import { IAuthService } from "@core/interfaces/IAuthService";
import { IUserProfileRepository } from "@core/interfaces/IUserProfileRepository";
import { EUserGender } from "@core/enums/UserGender";
import { USE_MOCK_AUTH } from "@config/constants";
import { PermissionIndicatorStatus } from "@ui/atoms/StatusIndicator/StatusIndicator.interface";

const MOCK_USER_PROFILE: UserProfile = {
  userId: "mock-user-001",
  firstName: "Demo",
  lastName: "User",
  birthDate: "1990-01-01",
  mobile: "9999999999",
  gender: EUserGender.MALE,
  onboardingComplete: true,
};

type AppInitialisationStatus = "LOADING" | "COMPLETE";
type LoginStatus = "IDLE" | "LOADING" | "ERROR";
type SignUpStatus = "IDLE" | "LOADING" | "ERROR";

interface AppStoreState {
  appInitialisationStatus: AppInitialisationStatus;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  loginStatus: LoginStatus;
  loginErrorMessage: string | null;
  signUpStatus: SignUpStatus;
  signUpErrorMessage: string | null;
  selectedRole: EAppRole | null;
  userProfile: UserProfile | null;
  babyProfile: BabyProfile | null;
  permissionCheckStatus: EPermissionStatus;
  permissionStatuses: Record<string, PermissionIndicatorStatus>;
  initializeAppSession: () => Promise<void>;
  handleLoginSubmit: (email: string, password: string) => Promise<void>;
  handleSignUpSubmit: (email: string, password: string) => Promise<void>;
  setIsAuthenticated: (value: boolean) => void;
  setOnboardingComplete: (value: boolean) => void;
  setSelectedRole: (role: EAppRole) => void;
  setUserProfile: (userProfile: UserProfile) => void;
  setBabyProfile: (babyProfile: BabyProfile) => void;
  checkAndRequestPermissions: (role: EAppRole) => Promise<void>;
  openDeviceSettings: () => Promise<void>;
}

async function loadUserProfileIntoStore(
  userId: string,
  setter: (state: Partial<AppStoreState>) => void,
): Promise<void> {
  const userProfileRepository =
    applicationContainer.resolve<IUserProfileRepository>(
      ServiceTokens.UserProfileRepository,
    );
  const fetchedUserProfile = await userProfileRepository.getUserProfile(userId);
  if (fetchedUserProfile) {
    setter({
      userProfile: fetchedUserProfile,
      isOnboardingComplete: fetchedUserProfile.onboardingComplete,
    });
  }
}

export const useAppStore = create<AppStoreState>((set) => ({
  appInitialisationStatus: "LOADING",
  isAuthenticated: false,
  isOnboardingComplete: false,
  loginStatus: "IDLE",
  loginErrorMessage: null,
  signUpStatus: "IDLE",
  signUpErrorMessage: null,
  selectedRole: null,
  userProfile: null,
  babyProfile: null,
  permissionCheckStatus: EPermissionStatus.PENDING,
  permissionStatuses: {},

  initializeAppSession: async () => {
    const authService = applicationContainer.resolve<IAuthService>(
      ServiceTokens.AuthService,
    );
    const restoredUserSession = await authService.restoreSession();
    if (!restoredUserSession) {
      set({ isAuthenticated: false, appInitialisationStatus: "COMPLETE" });
      return;
    }
    set({ isAuthenticated: true });
    await loadUserProfileIntoStore(restoredUserSession.userId, set);
    set({ appInitialisationStatus: "COMPLETE" });
  },

  handleLoginSubmit: async (email: string, password: string) => {
    set({ loginStatus: "LOADING", loginErrorMessage: null });
    try {
      if (USE_MOCK_AUTH) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        set({
          isAuthenticated: true,
          loginStatus: "IDLE",
          userProfile: MOCK_USER_PROFILE,
          isOnboardingComplete: MOCK_USER_PROFILE.onboardingComplete,
        });
        return;
      }
      const authService = applicationContainer.resolve<IAuthService>(
        ServiceTokens.AuthService,
      );
      const userSession = await authService.signInWithEmailAndPassword(
        email,
        password,
      );
      set({ isAuthenticated: true, loginStatus: "IDLE" });
      await loadUserProfileIntoStore(userSession.userId, set);
    } catch (loginError) {
      const errorMessage =
        loginError instanceof Error
          ? loginError.message
          : "Sign in failed. Please try again.";
      set({ loginStatus: "ERROR", loginErrorMessage: errorMessage });
    }
  },

  handleSignUpSubmit: async (email: string, password: string) => {
    set({ signUpStatus: "LOADING", signUpErrorMessage: null });
    try {
      const authService = applicationContainer.resolve<IAuthService>(
        ServiceTokens.AuthService,
      );
      const userSession = await authService.signUpWithEmailAndPassword(
        email,
        password,
      );
      set({ isAuthenticated: true, signUpStatus: "IDLE" });
      await loadUserProfileIntoStore(userSession.userId, set);
    } catch (signUpError) {
      const errorMessage =
        signUpError instanceof Error
          ? signUpError.message
          : "Sign up failed. Please try again.";
      set({ signUpStatus: "ERROR", signUpErrorMessage: errorMessage });
    }
  },

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setOnboardingComplete: (value) => set({ isOnboardingComplete: value }),
  setSelectedRole: (role) => set({ selectedRole: role }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setBabyProfile: (babyProfile) => set({ babyProfile }),

  checkAndRequestPermissions: async (role: EAppRole) => {
    set({ permissionCheckStatus: EPermissionStatus.CHECKING });

    // Web platform has no native permissions — auto-grant all
    if (Platform.OS === "web") {
      const webPermissionKeys =
        role === EAppRole.BABY_STATION
          ? ["microphone", "localNetwork", "batteryOptimisation"]
          : ["localNetwork", "notifications", "batteryOptimisation"];
      const grantedStatuses: Record<string, PermissionIndicatorStatus> = {};
      webPermissionKeys.forEach((permissionKey) => {
        grantedStatuses[permissionKey] = "GRANTED";
      });
      set({
        permissionStatuses: grantedStatuses,
        permissionCheckStatus: EPermissionStatus.ALL_GRANTED,
      });
      return;
    }

    const updatedPermissionStatuses: Record<string, PermissionIndicatorStatus> =
      {};
    let hasDeniedPermission = false;

    if (role === EAppRole.BABY_STATION) {
      // Microphone permission via expo-audio
      try {
        const { requestRecordingPermissionsAsync } = await import("expo-audio");
        const microphonePermissionResponse =
          await requestRecordingPermissionsAsync();
        updatedPermissionStatuses["microphone"] =
          microphonePermissionResponse.granted ? "GRANTED" : "DENIED";
        if (!microphonePermissionResponse.granted) hasDeniedPermission = true;
      } catch {
        updatedPermissionStatuses["microphone"] = "DENIED";
        hasDeniedPermission = true;
      }
    }

    if (role === EAppRole.PARENT_STATION) {
      // Notifications permission via expo-notifications
      try {
        const Notifications = await import("expo-notifications");
        const notificationPermissionResponse =
          await Notifications.requestPermissionsAsync();
        updatedPermissionStatuses["notifications"] =
          notificationPermissionResponse.granted ? "GRANTED" : "DENIED";
        if (!notificationPermissionResponse.granted) hasDeniedPermission = true;
      } catch {
        updatedPermissionStatuses["notifications"] = "DENIED";
        hasDeniedPermission = true;
      }
    }

    // Local network and battery optimisation cannot be checked via API —
    // mark as granted since the OS handles them at install time on most devices
    updatedPermissionStatuses["localNetwork"] = "GRANTED";
    updatedPermissionStatuses["batteryOptimisation"] = "GRANTED";

    const finalPermissionStatus = hasDeniedPermission
      ? EPermissionStatus.PARTIALLY_DENIED
      : EPermissionStatus.ALL_GRANTED;

    set({
      permissionStatuses: updatedPermissionStatuses,
      permissionCheckStatus: finalPermissionStatus,
    });
  },

  openDeviceSettings: async () => {
    await Linking.openSettings();
  },
}));
