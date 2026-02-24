import { IUserProfileRepository } from "@core/interfaces/IUserProfileRepository";
import { UserProfile } from "@core/entities/UserProfile";
import { EUserGender } from "@core/enums/UserGender";
import { supabaseClient } from "@infrastructure/supabase/supabaseClient";

export class SupabaseUserProfileRepository implements IUserProfileRepository {
  async saveUserProfile(userProfile: UserProfile): Promise<void> {
    const { error } = await supabaseClient.from("user_profiles").upsert({
      userId: userProfile.userId,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      birthDate: userProfile.birthDate,
      mobile: userProfile.mobile,
      gender: userProfile.gender,
      onboardingComplete: userProfile.onboardingComplete,
    });
    if (error) throw new Error(error.message);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabaseClient
      .from("user_profiles")
      .select("*")
      .eq("userId", userId)
      .single();
    if (error || !data) return null;
    return {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      mobile: data.mobile,
      gender: data.gender as EUserGender,
      onboardingComplete: data.onboardingComplete,
    };
  }

  async markOnboardingComplete(userId: string): Promise<void> {
    const { error } = await supabaseClient
      .from("user_profiles")
      .update({ onboardingComplete: true })
      .eq("userId", userId);
    if (error) throw new Error(error.message);
  }

  async isOnboardingComplete(userId: string): Promise<boolean> {
    const { data, error } = await supabaseClient
      .from("user_profiles")
      .select("onboardingComplete")
      .eq("userId", userId)
      .single();
    if (error || !data) return false;
    return data.onboardingComplete === true;
  }
}
