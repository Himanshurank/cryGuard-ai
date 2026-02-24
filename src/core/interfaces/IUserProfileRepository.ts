import { UserProfile } from "@core/entities/UserProfile";

export interface IUserProfileRepository {
  saveUserProfile(userProfile: UserProfile): Promise<void>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  markOnboardingComplete(userId: string): Promise<void>;
  isOnboardingComplete(userId: string): Promise<boolean>;
}
