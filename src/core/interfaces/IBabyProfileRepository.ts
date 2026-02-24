import { BabyProfile } from "@core/entities/BabyProfile";

export interface IBabyProfileRepository {
  saveBabyProfile(babyProfile: BabyProfile): Promise<void>;
  getBabyProfile(userId: string): Promise<BabyProfile | null>;
}
