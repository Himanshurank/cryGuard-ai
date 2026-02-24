import { EUserGender } from "@core/enums/UserGender";

export type OnboardingSaveStatus = "IDLE" | "LOADING" | "ERROR";

export interface OnboardingFormFieldErrors {
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  mobile: string | null;
  gender: string | null;
}

export interface OnboardingFormProps {
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  mobile: string;
  gender: EUserGender | null;
  fieldErrors: OnboardingFormFieldErrors;
  saveStatus: OnboardingSaveStatus;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onBirthDateChange: (value: Date) => void;
  onMobileChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onSubmit: () => void;
}
