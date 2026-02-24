# 📏 CryGuard Best Practices & Rules

This document outlines the authoritative rules for the CryGuard application. You must refer to the specific documentation files linked below before and during implementation.

- **Always** use **Atomic Design** (`atoms → molecules → organisms → screens`) as per `docs/ARCHITECTURE.md` when creating a new UI component.
- **Always** follow **SOLID principles** and Layered Architecture directory boundaries (`core → application → infrastructure → ui`) as per `docs/ARCHITECTURE.md` when making classes, services, and business logic.
- **Always** conform exactly to the offline-first and battery-optimization requirements as defined in `PRD.md`.
- **Always** update and reference the highly detailed implementation checklist in `docs/TASKS.md` to track project status.
- **Always** check off and update `docs/TASKS.md` immediately upon completing a task or milestone.
- **Never** place business logic inside React Native components; always use **Dependency Inversion** relying on interfaces defined in `src/core/interfaces/` as detailed in `docs/ARCHITECTURE.md`.
- **Never** import a concrete infrastructure class (e.g. `SupabaseAuthService`, `TcpSocketService`) anywhere except `src/config/container/registerServices.ts`. All other code resolves dependencies via `applicationContainer.resolve<IInterface>(ServiceTokens.Token)`.
- **Always** register every new service in `src/config/container/registerServices.ts` and add its token to `src/config/serviceTokens.ts` before using it anywhere.
- **Always** use strict TypeScript (`strict: true`) with no `any` types.
- **Always** use absolute imports via path aliases (`@core/`, `@application/`, `@infrastructure/`, `@ui/`, `@config/`) instead of relative paths.
- **Never** create empty files or directories prematurely; only create them when writing code that actually requires them.
- **Never** write any code or execute project modifications without explicit prior permission from the user.
- **Always** use full, descriptive names for every function, class, method, and variable. Names must clearly communicate intent without requiring a comment to explain them. Examples:
  - ❌ `fn`, `svc`, `res`, `val`, `tmp`, `data`, `obj`, `cb`, `e`, `err`
  - ✅ `handleUserLoginSubmit`, `supabaseUserProfileService`, `fetchedUserProfile`, `onboardingCompletionStatus`
  - A reader must be able to understand what a symbol does purely from its name, with zero surrounding context.
- **Always** rename any existing symbol whose name is ambiguous, too short, or does not clearly describe its purpose before building on top of it. Do not leave unclear names in place just because they already exist.
- **Always** use a `const enum` or `enum` for any set of string/number literal values that belong to the same logical group (e.g. message types, status codes, roles, event names). Never compare against raw string or number literals when an enum can represent them. Enum names must be prefixed with `E` and all keys must be `SCREAMING_SNAKE_CASE`. Example:
  - ❌ `if (type === 'PING' || type === 'CRY_ALERT')`
  - ✅ `if (type === ETcpMessageType.HEARTBEAT || type === ETcpMessageType.CRY_ALERT)`
- **Always** stop and ask for user permission after completing each task before proceeding to the next one.
- **Never** create garbage — no placeholder files, no empty exports, no `// TODO` stub files. Every file created must contain real, working code.
- **Always** delete any file that becomes unused after a refactor or change. No dead files left in the repo.
- **Always** remove unused imports, unused variables, and unused functions before marking a task complete. Every line in every file must be actively used.
