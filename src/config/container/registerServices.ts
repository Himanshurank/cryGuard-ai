// Composition root — the ONLY file allowed to import concrete infrastructure classes.
// Add one line per service as each infrastructure class is implemented.

import { applicationContainer } from "@config/container/ServiceContainer";
import ServiceTokens from "@config/serviceTokens";
import { SupabaseAuthService } from "@infrastructure/supabase/SupabaseAuthService";

export function registerAllServices(): void {
  applicationContainer.registerSingleton(
    ServiceTokens.AuthService,
    () => new SupabaseAuthService(),
  );
}
