export type LoginStatus = "IDLE" | "LOADING" | "ERROR";

export interface LoginFormProps {
  loginStatus: LoginStatus;
  errorMessage: string | null;
  onLoginSubmit: (email: string, password: string) => void;
  onNavigateToSignUp: () => void;
}
