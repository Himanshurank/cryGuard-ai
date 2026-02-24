import { IAuthService } from "@core/interfaces/IAuthService";
import { UserSession } from "@core/entities/UserSession";
import { supabaseClient } from "@infrastructure/supabase/supabaseClient";

export class SupabaseAuthService implements IAuthService {
  async restoreSession(): Promise<UserSession | null> {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error || !data.session) return null;
    return {
      userId: data.session.user.id,
      email: data.session.user.email ?? "",
      accessToken: data.session.access_token,
    };
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserSession> {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.session) {
      throw new Error(error?.message ?? "Sign in failed. Please try again.");
    }
    return {
      userId: data.session.user.id,
      email: data.session.user.email ?? "",
      accessToken: data.session.access_token,
    };
  }

  async signUpWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserSession> {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
    // When email confirmation is enabled, session is null but user is created.
    // Use the user object directly and sign in immediately to get a session.
    if (!data.session && data.user) {
      const { data: signInData, error: signInError } =
        await supabaseClient.auth.signInWithPassword({ email, password });
      if (signInError || !signInData.session) {
        throw new Error(
          "Account created. Please check your email to confirm your account.",
        );
      }
      return {
        userId: signInData.session.user.id,
        email: signInData.session.user.email ?? "",
        accessToken: signInData.session.access_token,
      };
    }
    if (!data.session) {
      throw new Error("Sign up failed. Please try again.");
    }
    return {
      userId: data.session.user.id,
      email: data.session.user.email ?? "",
      accessToken: data.session.access_token,
    };
  }

  async signOut(): Promise<void> {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }
}
