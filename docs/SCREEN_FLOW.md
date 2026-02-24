# CryGuard — Screen Flow & Navigation Plan

**Version:** 2.0
**Status:** Approved

---

## 1. Navigation Stack Overview

```
AppNavigator
├── AuthStack              (unauthenticated users)
│   ├── SplashScreen
│   ├── LoginScreen
│   └── SignUpScreen
│
├── OnboardingStack        (authenticated but profile incomplete — first launch only)
│   ├── UserProfileScreen
│   └── BabyProfileScreen
│
└── AppStack               (authenticated + profile complete)
    ├── RoleSelectionScreen
    ├── PermissionsScreen
    ├── BabyStationScreen
    └── ParentStationScreen
```

`AppNavigator` reads two flags from `useAppStore`:

- `isAuthenticated` — switches between `AuthStack` and the rest.
- `isOnboardingComplete` — switches between `OnboardingStack` and `AppStack`.

No screen manually navigates across stacks. State drives routing.

---

## 2. Screen Inventory

| Screen                | Stack           | Route Name      | Purpose                                                           |
| --------------------- | --------------- | --------------- | ----------------------------------------------------------------- |
| `SplashScreen`        | AuthStack       | `Splash`        | App init, check persisted session + onboarding flag               |
| `LoginScreen`         | AuthStack       | `Login`         | Supabase email/password sign in + link to sign up                 |
| `SignUpScreen`        | AuthStack       | `SignUp`        | Create Supabase account (email + password only)                   |
| `UserProfileScreen`   | OnboardingStack | `UserProfile`   | Collect parent's first name, last name, birthdate, mobile, gender |
| `BabyProfileScreen`   | OnboardingStack | `BabyProfile`   | Collect baby's name, birthdate, gender                            |
| `RoleSelectionScreen` | AppStack        | `RoleSelection` | Pick Baby Station or Parent Station for this session              |
| `PermissionsScreen`   | AppStack        | `Permissions`   | Request mic, network, notification, battery permissions           |
| `BabyStationScreen`   | AppStack        | `BabyStation`   | Active monitoring — mic live, AI running, TCP server open         |
| `ParentStationScreen` | AppStack        | `ParentStation` | Listening mode — TCP client, heartbeat monitor, alarm             |

---

## 3. Full Navigation Flow Diagram

```
APP LAUNCH
    │
    ▼
┌───────────────┐
│  SplashScreen │  checks session + onboarding flag
└───────┬───────┘
        │
   ┌────┴──────────────────────────────────────┐
   │                                            │
no session                               session exists
   │                                            │
   ▼                                    ┌───────┴────────────────┐
┌─────────────┐                         │                        │
│ LoginScreen │◄──── "Sign In" ────►    │  onboarding            │  onboarding
└──────┬──────┘                         │  incomplete            │  complete
       │                                │                        │
  "Sign Up"                             ▼                        ▼
       │                       ┌─────────────────┐    ┌──────────────────────┐
       ▼                       │ UserProfileScreen│    │  RoleSelectionScreen │
┌──────────────┐               └────────┬────────┘    └──────────────────────┘
│ SignUpScreen │                        │
└──────┬───────┘               "Next" (save user profile)
       │                                │
  account created                       ▼
       │                       ┌─────────────────┐
       ▼                       │ BabyProfileScreen│
┌─────────────────┐            └────────┬────────┘
│ UserProfileScreen│                    │
└─────────────────┘            "Done" (save baby profile → mark onboarding complete)
                                        │
                                        ▼
                               ┌──────────────────────┐
                               │  RoleSelectionScreen  │
                               └──────────┬───────────┘
                                          │
                             ┌────────────┴────────────┐
                             │                          │
                       Baby Station               Parent Station
                             │                          │
                             ▼                          ▼
                    ┌─────────────────┐       ┌─────────────────┐
                    │PermissionsScreen│       │PermissionsScreen│
                    │ (Baby variant)  │       │(Parent variant) │
                    └────────┬────────┘       └────────┬────────┘
                             │                          │
                  all permissions granted    all permissions granted
                             │                          │
                             ▼                          ▼
                    ┌─────────────────┐       ┌──────────────────┐
                    │BabyStationScreen│       │ParentStationScreen│
                    └─────────────────┘       └──────────────────┘
```

---

## 4. Screen-by-Screen Specification

---

### 4.1 SplashScreen

**Route:** `Splash` | **Stack:** AuthStack

**Purpose:** App entry point. Initialises the DI container, checks persisted session and onboarding completion, then routes accordingly.

**UI:** App logo centered + subtle loading indicator.

**Logic (in `useAppStore`):**

1. `registerAllServices()` runs in `App.tsx` before this screen mounts.
2. `IAuthService.restoreSession()` is called.
3. No session → navigate to `Login` (replace).
4. Session exists + onboarding incomplete → navigate to `UserProfile` (replace).
5. Session exists + onboarding complete → navigate to `RoleSelection` (replace).

**States:**

| State          | UI Behaviour                      |
| -------------- | --------------------------------- |
| `initialising` | Logo + spinner                    |
| `redirecting`  | Instant navigation, no user input |

**No back navigation.** Always replaced, never pushed.

---

### 4.2 LoginScreen

**Route:** `Login` | **Stack:** AuthStack

**Purpose:** Sign in with Supabase email + password. Entry point for returning users.

**UI Composition:**

```
LoginScreen
└── LoginForm (organism)
    ├── AppText (atom)          — app logo / "Welcome back"
    ├── AppTextInput (atom)     — email field
    ├── AppTextInput (atom)     — password field
    ├── AppButton (atom)        — "Sign In"
    ├── AppText (atom)          — error message (conditional)
    └── AppButton (atom)        — "Don't have an account? Sign Up" (ghost style)
```

**Logic:**

1. "Sign In" → `useAppStore.handleLoginSubmit(email, password)`.
2. Calls `IAuthService.signInWithEmailAndPassword()`.
3. Success + onboarding complete → `RoleSelection` (replace).
4. Success + onboarding incomplete → `UserProfile` (replace).
5. Failure → inline error.
6. "Sign Up" → navigate to `SignUp`.

**States:**

| State     | UI Behaviour                          |
| --------- | ------------------------------------- |
| `idle`    | Form enabled, button active           |
| `loading` | Form disabled, button shows spinner   |
| `error`   | Form re-enabled, error text below CTA |

---

### 4.3 SignUpScreen

**Route:** `SignUp` | **Stack:** AuthStack

**Purpose:** Create a new Supabase account. Collects only email + password here — profile details are collected in the onboarding flow immediately after.

**UI Composition:**

```
SignUpScreen
└── SignUpForm (organism)
    ├── AppText (atom)          — "Create your account"
    ├── AppTextInput (atom)     — email field
    ├── AppTextInput (atom)     — password field
    ├── AppTextInput (atom)     — confirm password field
    ├── AppButton (atom)        — "Create Account"
    ├── AppText (atom)          — error message (conditional)
    └── AppButton (atom)        — "Already have an account? Sign In" (ghost style)
```

**Logic:**

1. Validates password === confirm password client-side.
2. "Create Account" → `useAppStore.handleSignUpSubmit(email, password)`.
3. Calls `IAuthService.signUpWithEmailAndPassword()`.
4. Success → navigate to `UserProfile` (replace — onboarding begins).
5. Failure → inline error.
6. "Sign In" → navigate back to `Login`.

**States:**

| State               | UI Behaviour                                  |
| ------------------- | --------------------------------------------- |
| `idle`              | Form enabled                                  |
| `loading`           | Form disabled, spinner                        |
| `password_mismatch` | Inline error under confirm field, no API call |
| `error`             | API error shown below CTA                     |

---

### 4.4 UserProfileScreen

**Route:** `UserProfile` | **Stack:** OnboardingStack

**Purpose:** Step 1 of 2 in onboarding. Collects the parent/user's personal details.

**UI Composition:**

```
UserProfileScreen
├── OnboardingProgressBar (molecule)   — step 1 of 2
├── AppText (atom)                     — "Tell us about yourself"
├── OnboardingForm (organism)
│   ├── AppTextInput (atom)            — First Name *
│   ├── AppTextInput (atom)            — Last Name *
│   ├── DatePickerInput (molecule)     — Date of Birth *
│   │   ├── AppTextInput (atom)        — display field
│   │   └── native DatePicker
│   ├── AppTextInput (atom)            — Mobile Number *
│   ├── GenderSelector (molecule)      — Gender *
│   │   ├── AppButton (atom)           — "Male"
│   │   ├── AppButton (atom)           — "Female"
│   │   └── AppButton (atom)           — "Prefer not to say"
│   └── AppButton (atom)               — "Next →"
└── AppText (atom)                     — field-level validation errors
```

**Fields:**

| Field         | Type   | Required | Validation                         |
| ------------- | ------ | :------: | ---------------------------------- |
| First Name    | string |    ✅    | min 2 chars, letters only          |
| Last Name     | string |    ✅    | min 2 chars, letters only          |
| Date of Birth | date   |    ✅    | must be 18+ years old              |
| Mobile        | string |    ✅    | valid phone format                 |
| Gender        | enum   |    ✅    | `Male \| Female \| PreferNotToSay` |

**Logic:**

1. Validates all fields on "Next".
2. `useOnboardingStore.saveUserProfile(userProfileData)`.
3. Calls `IUserProfileRepository.saveUserProfile()` → persists to Supabase `user_profiles` table.
4. On success → navigate to `BabyProfile`.
5. On failure → inline field errors.

**No back navigation** — user cannot go back to `SignUp` from here.

---

### 4.5 BabyProfileScreen

**Route:** `BabyProfile` | **Stack:** OnboardingStack

**Purpose:** Step 2 of 2 in onboarding. Collects the baby's details.

**UI Composition:**

```
BabyProfileScreen
├── OnboardingProgressBar (molecule)   — step 2 of 2
├── AppText (atom)                     — "Now, tell us about your baby"
├── BabyProfileForm (organism)
│   ├── AppTextInput (atom)            — Baby's Name *
│   ├── DatePickerInput (molecule)     — Baby's Date of Birth *
│   ├── GenderSelector (molecule)      — Baby's Gender *
│   │   ├── AppButton (atom)           — "Boy"
│   │   ├── AppButton (atom)           — "Girl"
│   │   └── AppButton (atom)           — "Prefer not to say"
│   └── AppButton (atom)               — "Done →"
└── AppText (atom)                     — field-level validation errors
```

**Fields:**

| Field         | Type   | Required | Validation                           |
| ------------- | ------ | :------: | ------------------------------------ |
| Baby Name     | string |    ✅    | min 2 chars                          |
| Date of Birth | date   |    ✅    | must not be in the future, max 5 yrs |
| Gender        | enum   |    ✅    | `Boy \| Girl \| PreferNotToSay`      |

**Logic:**

1. Validates all fields on "Done".
2. `useOnboardingStore.saveBabyProfile(babyProfileData)`.
3. Calls `IBabyProfileRepository.saveBabyProfile()` → persists to Supabase `baby_profiles` table.
4. Calls `IUserProfileRepository.markOnboardingComplete()` → sets flag in Supabase.
5. `useAppStore.setOnboardingComplete(true)` → triggers `AppNavigator` to switch to `AppStack`.
6. Navigates to `RoleSelection` (replace entire OnboardingStack).

**Back navigation:** Allowed → goes back to `UserProfile` (user can correct their info).

---

### 4.6 RoleSelectionScreen

**Route:** `RoleSelection` | **Stack:** AppStack

**Purpose:** User selects which role this device will play for the current session. Shown every session — role is not persisted.

**UI Composition:**

```
RoleSelectionScreen
├── AppText (atom)              — "Hi [firstName]! Which device is this?"
├── RoleSelectionCard (molecule) — "Baby Station"
│   ├── AppIcon (atom)
│   ├── AppText (atom)          — title
│   └── AppText (atom)          — description
├── RoleSelectionCard (molecule) — "Parent Station"
│   ├── AppIcon (atom)
│   ├── AppText (atom)          — title
│   └── AppText (atom)          — description
└── AppButton (atom)            — "Continue" (disabled until role selected)
```

**Logic:**

1. Greets user by first name from `useAppStore.userProfile.firstName`.
2. Taps card → `useAppStore.setSelectedRole(AppRole)`.
3. "Continue" → navigate to `Permissions`.

**States:**

| State      | UI Behaviour                           |
| ---------- | -------------------------------------- |
| `none`     | Both cards neutral, Continue disabled  |
| `selected` | One card highlighted, Continue enabled |

---

### 4.7 PermissionsScreen

**Route:** `Permissions` | **Stack:** AppStack

**Purpose:** Request all required native permissions before the active monitoring screen mounts. Auto-skips if all already granted.

**UI Composition:**

```
PermissionsScreen
├── AppText (atom)              — "CryGuard needs a few permissions"
├── PermissionRow (molecule) × N
│   ├── AppIcon (atom)
│   ├── AppText (atom)          — permission name + reason
│   └── StatusIndicator (atom) — granted / denied / pending
└── AppButton (atom)            — "Grant Permissions" / "Continue" / "Open Settings"
```

**Permissions by role:**

| Permission           | Baby Station | Parent Station |
| -------------------- | :----------: | :------------: |
| Microphone           |      ✅      |       ❌       |
| Local Network        |      ✅      |       ✅       |
| Notifications        |      ❌      |       ✅       |
| Battery Optimisation |      ✅      |       ✅       |

**States:**

| State                | UI Behaviour                                        |
| -------------------- | --------------------------------------------------- |
| `checking`           | Spinner, no button                                  |
| `all_granted`        | Auto-navigates immediately                          |
| `pending`            | "Grant Permissions" button active                   |
| `partially_denied`   | Denied rows show red indicator, button still active |
| `permanently_denied` | "Open Settings" button, explanatory text            |

---

### 4.8 BabyStationScreen

**Route:** `BabyStation` | **Stack:** AppStack

**Purpose:** Active monitoring screen. Mic live, AI running, TCP server open, heartbeat broadcasting.

**UI Composition:**

```
BabyStationScreen
└── BabyStationDashboard (organism)
    ├── ConnectionStatusBar (molecule)   — TCP status + parent IP
    ├── HeartbeatPulse (molecule)        — animated pulse, "Heartbeat sent Xs ago"
    ├── StatusIndicator (atom)           — "Listening..." / "CRY DETECTED"
    ├── AppText (atom)                   — baby name from profile e.g. "Monitoring Arya"
    └── AppButton (atom)                 — "Stop Monitoring"
```

**Logic (via `useBabyStationStore`):**

1. On mount → `StartBabyStationUseCase.execute()`.
2. On cry → `ITcpSocketService.sendCryAlert()` + `LogCryEventUseCase.execute()`.
3. Heartbeat every 10s.
4. "Stop Monitoring" → `StartBabyStationUseCase.stop()` → back to `RoleSelection`.

**States:**

| State                 | UI Behaviour                                  |
| --------------------- | --------------------------------------------- |
| `initialising`        | Spinner, "Starting monitor..."                |
| `waiting`             | Pulse animation, "Listening...", green status |
| `cry_detected`        | Red flash, "CRY DETECTED" banner              |
| `parent_connected`    | Connection bar green + parent IP              |
| `parent_disconnected` | Connection bar yellow warning                 |
| `error`               | Error message, "Restart" button               |

**No back gesture.**

---

### 4.9 ParentStationScreen

**Route:** `ParentStation` | **Stack:** AppStack

**Purpose:** Listening screen. TCP client, heartbeat monitor, full-screen alarm on cry.

**UI Composition:**

```
ParentStationScreen
└── ParentStationDashboard (organism)
    ├── ConnectionStatusBar (molecule)   — TCP status + baby device name
    ├── CryAlertBanner (molecule)        — hidden normally, full-screen on cry
    │   ├── AppIcon (atom)               — siren icon
    │   └── AppText (atom)              — "BABY IS CRYING"
    ├── HeartbeatPulse (molecule)        — "Last heartbeat Xs ago"
    ├── AppText (atom)                   — baby name e.g. "Listening for Arya"
    ├── EventHistoryList (organism)      — today's cry events from Supabase
    └── AppButton (atom)                 — "Disconnect"
```

**Logic (via `useParentStationStore`):**

1. On mount → `StartParentStationUseCase.execute()`.
2. `TcpMessageType.CryAlert` → `INotificationService.triggerAlarm()` + full-screen banner.
3. `TcpMessageType.Heartbeat` → `MonitorHeartbeatUseCase.resetTimer()`.
4. 2 missed heartbeats → `INotificationService.triggerConnectionLostAlert()`.
5. "Disconnect" → `StartParentStationUseCase.stop()` → back to `RoleSelection`.

**States:**

| State             | UI Behaviour                                             |
| ----------------- | -------------------------------------------------------- |
| `discovering`     | Spinner, "Looking for Baby Station..."                   |
| `connecting`      | Spinner, "Connecting..."                                 |
| `connected`       | Green status bar, heartbeat pulse visible                |
| `cry_alert`       | Full-screen red `CryAlertBanner`, alarm playing          |
| `connection_lost` | Red status bar, "Connection Lost" warning, pulsing alert |
| `disconnected`    | Grey status, "Tap to reconnect" button                   |
| `error`           | Error message, "Retry" button                            |

**No back gesture.**

---

## 5. Navigation Rules Summary

| Rule                                                                             |
| -------------------------------------------------------------------------------- |
| `SplashScreen` always uses `replace` — never pushed                              |
| `SignUpScreen` → `UserProfileScreen` uses `replace` (no back to signup)          |
| `BabyProfileScreen` "Done" replaces entire `OnboardingStack` with `AppStack`     |
| `BabyStationScreen` and `ParentStationScreen` disable back gesture               |
| `PermissionsScreen` auto-skips if all permissions already granted                |
| Auth state change (logout / session expiry) resets navigator to `AuthStack` root |
| Onboarding flag is checked on every cold start — re-enters onboarding if missing |

---

## 6. Data Entities Introduced

### UserProfile (saved to Supabase `user_profiles`)

| Field                | Type          | Notes                              |
| -------------------- | ------------- | ---------------------------------- |
| `userId`             | string (uuid) | FK → Supabase `auth.users`         |
| `firstName`          | string        |                                    |
| `lastName`           | string        |                                    |
| `birthDate`          | ISO date      |                                    |
| `mobile`             | string        |                                    |
| `gender`             | UserGender    | `Male \| Female \| PreferNotToSay` |
| `onboardingComplete` | boolean       |                                    |

### BabyProfile (saved to Supabase `baby_profiles`)

| Field       | Type          | Notes                           |
| ----------- | ------------- | ------------------------------- |
| `babyId`    | string (uuid) | PK                              |
| `userId`    | string (uuid) | FK → `user_profiles`            |
| `babyName`  | string        |                                 |
| `birthDate` | ISO date      |                                 |
| `gender`    | BabyGender    | `Boy \| Girl \| PreferNotToSay` |

---

## 7. New Interfaces Required

Two new interfaces needed in `src/core/interfaces/`:

- `IUserProfileRepository` — `saveUserProfile()`, `getUserProfile()`, `markOnboardingComplete()`
- `IBabyProfileRepository` — `saveBabyProfile()`, `getBabyProfile()`

Two new tokens in `src/config/serviceTokens.ts`:

- `ServiceTokens.UserProfileRepository`
- `ServiceTokens.BabyProfileRepository`

Two new implementations in `src/infrastructure/supabase/`:

- `SupabaseUserProfileRepository` — implements `IUserProfileRepository`
- `SupabaseBabyProfileRepository` — implements `IBabyProfileRepository`

New store: `useOnboardingStore` in `src/application/stores/`.

---

## 8. Store ↔ Screen Mapping

| Screen                | Primary Store           | Use Cases / Services Triggered                                      |
| --------------------- | ----------------------- | ------------------------------------------------------------------- |
| `SplashScreen`        | `useAppStore`           | `IAuthService.restoreSession`                                       |
| `LoginScreen`         | `useAppStore`           | `IAuthService.signInWithEmailAndPassword`                           |
| `SignUpScreen`        | `useAppStore`           | `IAuthService.signUpWithEmailAndPassword`                           |
| `UserProfileScreen`   | `useOnboardingStore`    | `IUserProfileRepository.saveUserProfile`                            |
| `BabyProfileScreen`   | `useOnboardingStore`    | `IBabyProfileRepository.saveBabyProfile`, `markOnboardingComplete`  |
| `RoleSelectionScreen` | `useAppStore`           | none (local state only)                                             |
| `PermissionsScreen`   | `useAppStore`           | native permission APIs                                              |
| `BabyStationScreen`   | `useBabyStationStore`   | `StartBabyStationUseCase`, `DetectCryUseCase`, `LogCryEventUseCase` |
| `ParentStationScreen` | `useParentStationStore` | `StartParentStationUseCase`, `MonitorHeartbeatUseCase`              |
