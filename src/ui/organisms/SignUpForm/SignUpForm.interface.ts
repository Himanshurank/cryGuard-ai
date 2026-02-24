export type SignUpStatus = "IDLE" | "LOADING" | "ERROR";

export interface SignUpFormProps {
  signUpStatus: SignUpStatus;
  errorMessage: string | null;
  onSignUpSubmit: (email: string, password: string) => void;
  onNavigateToLogin: () => void;
}
