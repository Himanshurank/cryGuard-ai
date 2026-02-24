import { create } from "zustand";
import { EAppRole } from "@core/enums/AppRole";
import { UserProfile } from "@core/entities/UserProfile";
import { BabyProfile } from "@core/entities/BabyProfile";

interface AppStoreState {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  selectedRole: EAppRole | null;
  userProfile: UserProfile | null;
  babyProfile: BabyProfile | null;
  setIsAuthenticated: (value: boolean) => void;
  setOnboardingComplete: (value: boolean) => void;
  setSelectedRole: (role: EAppRole) => void;
  setUserProfile: (userProfile: UserProfile) => void;
  setBabyProfile: (babyProfile: BabyProfile) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  isAuthenticated: false,
  isOnboardingComplete: false,
  selectedRole: null,
  userProfile: null,
  babyProfile: null,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setOnboardingComplete: (value) => set({ isOnboardingComplete: value }),
  setSelectedRole: (role) => set({ selectedRole: role }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setBabyProfile: (babyProfile) => set({ babyProfile }),
}));
