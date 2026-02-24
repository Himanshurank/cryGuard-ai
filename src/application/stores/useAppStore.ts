import { create } from "zustand";
import { EAppRole } from "@core/enums/AppRole";
import { UserProfile } from "@core/entities/UserProfile";
import { BabyProfile } from "@core/entities/BabyProfile";
import { applicationContainer } from "@config/container/ServiceContainer";
import ServiceTokens from "@config/serviceTokens";
import { IAuthService } from "@core/interfaces/IAuthService";

type AppInitialisationStatus = "LOADING" | "COMPLETE";
type LoginStatus = "IDLE" | "LOADING" | "ERROR";

interface AppStoreState {
  appInitialisationStatus: AppInitialisationStatus;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  loginStatus: LoginStatus;
  loginErrorMessage: string | null;
  selectedRole: EAppRole | null;
  userProfile: UserProfile | null;
  babyProfile: BabyProfile | null;
  initializeAppSession: () => Promise<void>;
  handleLoginSubmit: (email: string, password: string) => Promise<void>;
  setIsAuthenticated: (value: boolean) => void;
  setOnboardingComplete: (value: boolean) => void;
  setSelectedRole: (role: EAppRole) => void;
  setUserProfile: (userProfile: UserProfile) => void;
  setBabyProfile: (babyProfile: BabyProfile) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  appInitialisationStatus: "LOADING",
  isAuthenticated: false,
  isOnboardingComplete: false,
  loginStatus: "IDLE",
  loginErrorMessage: null,
  selectedRole: null,
  userProfile: null,
  babyProfile: null,
  initializeAppSession: async () => {
    const authService = applicationContainer.resolve<IAuthService>(
      ServiceTokens.AuthService,
    );
    const restoredUserSession = await authService.restoreSession();
    const isSessionActive = restoredUserSession !== null;
    set({
      isAuthenticated: isSessionActive,
      isOnboardingComplete: false,
      appInitialisationStatus: "COMPLETE",
    });
  },
  handleLoginSubmit: async (email: string, password: string) => {
    set({ loginStatus: "LOADING", loginErrorMessage: null });
    try {
      const authService = applicationContainer.resolve<IAuthService>(
        ServiceTokens.AuthService,
      );
      await authService.signInWithEmailAndPassword(email, password);
      set({ isAuthenticated: true, loginStatus: "IDLE" });
    } catch (loginError) {
      const errorMessage =
        loginError instanceof Error
          ? loginError.message
          : "Sign in failed. Please try again.";
      set({ loginStatus: "ERROR", loginErrorMessage: errorMessage });
    }
  },
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setOnboardingComplete: (value) => set({ isOnboardingComplete: value }),
  setSelectedRole: (role) => set({ selectedRole: role }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setBabyProfile: (babyProfile) => set({ babyProfile }),
}));
