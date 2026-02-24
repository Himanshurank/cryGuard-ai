import { IBabyProfileRepository } from "@core/interfaces/IBabyProfileRepository";
import { BabyProfile } from "@core/entities/BabyProfile";
import { EBabyGender } from "@core/enums/BabyGender";
import { supabaseClient } from "@infrastructure/supabase/supabaseClient";

export class SupabaseBabyProfileRepository implements IBabyProfileRepository {
  async saveBabyProfile(babyProfile: BabyProfile): Promise<void> {
    const { error } = await supabaseClient.from("baby_profiles").upsert({
      babyId: babyProfile.babyId,
      userId: babyProfile.userId,
      babyName: babyProfile.babyName,
      birthDate: babyProfile.birthDate,
      gender: babyProfile.gender,
    });
    if (error) throw new Error(error.message);
  }

  async getBabyProfile(userId: string): Promise<BabyProfile | null> {
    const { data, error } = await supabaseClient
      .from("baby_profiles")
      .select("*")
      .eq("userId", userId)
      .single();
    if (error || !data) return null;
    return {
      babyId: data.babyId,
      userId: data.userId,
      babyName: data.babyName,
      birthDate: data.birthDate,
      gender: data.gender as EBabyGender,
    };
  }
}
