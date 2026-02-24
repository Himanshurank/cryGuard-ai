import { EBabyGender } from "@core/enums/BabyGender";
import { BabyProfileFieldErrors } from "@application/stores/useOnboardingStore";

export interface BabyProfileFormProps {
  babyName: string;
  birthDate: Date | null;
  gender: EBabyGender | null;
  fieldErrors: BabyProfileFieldErrors;
  saveStatus: "IDLE" | "LOADING" | "ERROR";
  onBabyNameChange: (value: string) => void;
  onBirthDateChange: (value: Date) => void;
  onGenderChange: (value: string) => void;
  onSubmit: () => void;
}
