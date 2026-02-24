import { create } from "zustand";
import { UserProfile } from "@core/entities/UserProfile";
import { BabyProfile } from "@core/entities/BabyProfile";
import { EUserGender } from "@core/enums/UserGender";
import { EBabyGender } from "@core/enums/BabyGender";
import { applicationContainer } from "@config/container/ServiceContainer";
import ServiceTokens from "@config/serviceTokens";
import { IUserProfileRepository } from "@core/interfaces/IUserProfileRepository";
import { IBabyProfileRepository } from "@core/interfaces/IBabyProfileRepository";
import { IAuthService } from "@core/interfaces/IAuthService";
import {
  validateFirstName,
  validateLastName,
  validateUserBirthDate,
  validateMobile,
  validateUserGender,
  validateBabyName,
  validateBabyBirthDate,
  validateBabyGender,
} from "@application/validation/onboardingValidation";

type SaveStatus = "IDLE" | "LOADING" | "ERROR";

export interface UserProfileFieldErrors {
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  mobile: string | null;
  gender: string | null;
}

export interface BabyProfileFieldErrors {
  babyName: string | null;
  birthDate: string | null;
  gender: string | null;
}

interface OnboardingStoreState {
  // User profile form
  userFirstName: string;
  userLastName: string;
  userBirthDate: Date | null;
  userMobile: string;
  userGender: EUserGender | null;
  userProfileFieldErrors: UserProfileFieldErrors;
  saveUserProfileStatus: SaveStatus;
  userProfileErrorMessage: string | null;

  // Baby profile form
  babyName: string;
  babyBirthDate: Date | null;
  babyGender: EBabyGender | null;
  babyProfileFieldErrors: BabyProfileFieldErrors;
  saveBabyProfileStatus: SaveStatus;
  babyProfileErrorMessage: string | null;

  // Actions
  setUserFirstName: (value: string) => void;
  setUserLastName: (value: string) => void;
  setUserBirthDate: (value: Date) => void;
  setUserMobile: (value: string) => void;
  setUserGender: (value: string) => void;
  saveUserProfile: () => Promise<void>;
  setBabyName: (value: string) => void;
  setBabyBirthDate: (value: Date) => void;
  setBabyGender: (value: string) => void;
  saveBabyProfile: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingStoreState>((set, get) => ({
  userFirstName: "",
  userLastName: "",
  userBirthDate: null,
  userMobile: "",
  userGender: null,
  userProfileFieldErrors: {
    firstName: null,
    lastName: null,
    birthDate: null,
    mobile: null,
    gender: null,
  },
  saveUserProfileStatus: "IDLE",
  userProfileErrorMessage: null,

  babyName: "",
  babyBirthDate: null,
  babyGender: null,
  babyProfileFieldErrors: {
    babyName: null,
    birthDate: null,
    gender: null,
  },
  saveBabyProfileStatus: "IDLE",
  babyProfileErrorMessage: null,

  setUserFirstName: (value) => set({ userFirstName: value }),
  setUserLastName: (value) => set({ userLastName: value }),
  setUserBirthDate: (value) => set({ userBirthDate: value }),
  setUserMobile: (value) => set({ userMobile: value }),
  setUserGender: (value) => set({ userGender: value as EUserGender }),

  saveUserProfile: async () => {
    const {
      userFirstName,
      userLastName,
      userBirthDate,
      userMobile,
      userGender,
    } = get();

    const fieldErrors: UserProfileFieldErrors = {
      firstName: validateFirstName(userFirstName),
      lastName: validateLastName(userLastName),
      birthDate: validateUserBirthDate(userBirthDate),
      mobile: validateMobile(userMobile),
      gender: validateUserGender(userGender),
    };

    const hasValidationErrors = Object.values(fieldErrors).some(
      (fieldError) => fieldError !== null,
    );

    if (hasValidationErrors) {
      set({ userProfileFieldErrors: fieldErrors });
      return;
    }

    set({
      saveUserProfileStatus: "LOADING",
      userProfileErrorMessage: null,
      userProfileFieldErrors: {
        firstName: null,
        lastName: null,
        birthDate: null,
        mobile: null,
        gender: null,
      },
    });

    try {
      const authService = applicationContainer.resolve<IAuthService>(
        ServiceTokens.AuthService,
      );
      const userSession = await authService.restoreSession();
      if (!userSession) throw new Error("No active session found.");

      const userProfileRepository =
        applicationContainer.resolve<IUserProfileRepository>(
          ServiceTokens.UserProfileRepository,
        );

      const userProfileToSave: UserProfile = {
        userId: userSession.userId,
        firstName: userFirstName.trim(),
        lastName: userLastName.trim(),
        birthDate: userBirthDate!.toISOString().split("T")[0],
        mobile: userMobile.trim(),
        gender: userGender!,
        onboardingComplete: false,
      };

      await userProfileRepository.saveUserProfile(userProfileToSave);
      set({ saveUserProfileStatus: "IDLE" });
    } catch (saveError) {
      const errorMessage =
        saveError instanceof Error
          ? saveError.message
          : "Failed to save profile. Please try again.";
      set({
        saveUserProfileStatus: "ERROR",
        userProfileErrorMessage: errorMessage,
      });
    }
  },

  setBabyName: (value) => set({ babyName: value }),
  setBabyBirthDate: (value) => set({ babyBirthDate: value }),
  setBabyGender: (value) => set({ babyGender: value as EBabyGender }),

  saveBabyProfile: async () => {
    const { babyName, babyBirthDate, babyGender } = get();

    const fieldErrors: BabyProfileFieldErrors = {
      babyName: validateBabyName(babyName),
      birthDate: validateBabyBirthDate(babyBirthDate),
      gender: validateBabyGender(babyGender),
    };

    const hasValidationErrors = Object.values(fieldErrors).some(
      (fieldError) => fieldError !== null,
    );

    if (hasValidationErrors) {
      set({ babyProfileFieldErrors: fieldErrors });
      return;
    }

    set({
      saveBabyProfileStatus: "LOADING",
      babyProfileErrorMessage: null,
      babyProfileFieldErrors: { babyName: null, birthDate: null, gender: null },
    });

    try {
      const authService = applicationContainer.resolve<IAuthService>(
        ServiceTokens.AuthService,
      );
      const userSession = await authService.restoreSession();
      if (!userSession) throw new Error("No active session found.");

      const babyProfileRepository =
        applicationContainer.resolve<IBabyProfileRepository>(
          ServiceTokens.BabyProfileRepository,
        );

      const userProfileRepository =
        applicationContainer.resolve<IUserProfileRepository>(
          ServiceTokens.UserProfileRepository,
        );

      const babyProfileToSave: BabyProfile = {
        babyId: `${userSession.userId}-baby`,
        userId: userSession.userId,
        babyName: babyName.trim(),
        birthDate: babyBirthDate!.toISOString().split("T")[0],
        gender: babyGender!,
      };

      await babyProfileRepository.saveBabyProfile(babyProfileToSave);
      await userProfileRepository.markOnboardingComplete(userSession.userId);
      set({ saveBabyProfileStatus: "IDLE" });
    } catch (saveError) {
      const errorMessage =
        saveError instanceof Error
          ? saveError.message
          : "Failed to save baby profile. Please try again.";
      set({
        saveBabyProfileStatus: "ERROR",
        babyProfileErrorMessage: errorMessage,
      });
    }
  },
}));
