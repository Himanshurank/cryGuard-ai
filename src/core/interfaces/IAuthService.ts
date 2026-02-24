import { UserSession } from "@core/entities/UserSession";

export interface IAuthService {
  signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserSession>;
  signUpWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserSession>;
  restoreSession(): Promise<UserSession | null>;
  signOut(): Promise<void>;
}
