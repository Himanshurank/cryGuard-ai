import { EBabyGender } from "@core/enums/BabyGender";

export interface BabyProfile {
  babyId: string;
  userId: string;
  babyName: string;
  birthDate: string;
  gender: EBabyGender;
}
