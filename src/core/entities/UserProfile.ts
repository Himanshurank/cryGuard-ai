import { EUserGender } from "@core/enums/UserGender";

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  mobile: string;
  gender: EUserGender;
  onboardingComplete: boolean;
}
