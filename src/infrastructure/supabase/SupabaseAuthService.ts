import { IAuthService } from "@core/interfaces/IAuthService";
import { UserSession } from "@core/entities/UserSession";

export class SupabaseAuthService implements IAuthService {
  async restoreSession(): Promise<UserSession | null> {
    // Supabase client is not yet available — returns null until credentials are configured.
    // This will be fully implemented once supabaseClient.ts is created.
    return null;
  }

  async signInWithEmailAndPassword(
    _email: string,
    _password: string,
  ): Promise<UserSession> {
    throw new Error(
      "SupabaseAuthService.signInWithEmailAndPassword: not yet implemented — awaiting Supabase credentials.",
    );
  }

  async signUpWithEmailAndPassword(
    _email: string,
    _password: string,
  ): Promise<UserSession> {
    throw new Error(
      "SupabaseAuthService.signUpWithEmailAndPassword: not yet implemented — awaiting Supabase credentials.",
    );
  }

  async signOut(): Promise<void> {
    throw new Error(
      "SupabaseAuthService.signOut: not yet implemented — awaiting Supabase credentials.",
    );
  }
}
