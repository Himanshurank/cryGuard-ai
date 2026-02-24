# CryGuard — Task Breakdown (Screen-First)

**Version:** 2.0
**Status:** In Progress

> Each screen section is self-contained: UI tasks first, then logic tasks.
> Complete every task in a screen before moving to the next screen.
> Mark tasks: `[ ]` pending · `[x]` done · `[-]` in progress

---

## PHASE 0 — One-Time Project Bootstrap

> Must be fully complete before any screen work begins. No UI, no logic — just the skeleton.

- [x] Install npm packages: `@supabase/supabase-js`, `zustand`, `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`, `react-native-tcp-socket`, `react-native-zeroconf`, `@tensorflow/tfjs`, `@tensorflow/tfjs-react-native`, `expo-av`, `expo-notifications`, `expo-keep-awake`, `babel-plugin-module-resolver`, `@expo/vector-icons`
- [x] Add path aliases to `tsconfig.json`: `@core/*`, `@application/*`, `@infrastructure/*`, `@ui/*`, `@navigation/*`, `@config/*`
- [x] Add path aliases to `babel.config.js` using `babel-plugin-module-resolver`
- [x] Add Android permissions to `app.json`: `RECORD_AUDIO`, `INTERNET`, `ACCESS_NETWORK_STATE`, `ACCESS_WIFI_STATE`, `FOREGROUND_SERVICE`, `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`
- [x] Add iOS permission descriptions to `app.json`: `NSMicrophoneUsageDescription`, `NSLocalNetworkUsageDescription`
- [ ] Create Supabase project, note `SUPABASE_URL` and `SUPABASE_ANON_KEY` — **manual action required**
- [ ] Create `user_profiles` table: `userId uuid PK FK auth.users`, `firstName text`, `lastName text`, `birthDate date`, `mobile text`, `gender text`, `onboardingComplete bool` — **manual action required**
- [ ] Create `baby_profiles` table: `babyId uuid PK`, `userId uuid FK`, `babyName text`, `birthDate date`, `gender text` — **manual action required**
- [ ] Create `cry_events` table: `eventId uuid PK`, `userId uuid FK`, `babyId uuid FK`, `detectedAt timestamptz`, `confidenceScore float` — **manual action required**
- [ ] Enable Row Level Security on all three tables — **manual action required**
- [ ] Create `src/infrastructure/supabase/supabaseClient.ts` — **blocked until Supabase credentials available**
- [x] Create all enums (E-prefix, SCREAMING_SNAKE_CASE keys):
  - [x] `src/core/enums/AppRole.ts` — `EAppRole { BABY_STATION | PARENT_STATION }`
  - [x] `src/core/enums/ConnectionStatus.ts` — `EConnectionStatus { DISCONNECTED | DISCOVERING | CONNECTING | CONNECTED | LOST }`
  - [x] `src/core/enums/TcpMessageType.ts` — `ETcpMessageType { HEARTBEAT | CRY_ALERT | ACK }`
  - [x] `src/core/enums/UserGender.ts` — `EUserGender { MALE | FEMALE | PREFER_NOT_TO_SAY }`
  - [x] `src/core/enums/BabyGender.ts` — `EBabyGender { BOY | GIRL | PREFER_NOT_TO_SAY }`
  - [x] `src/core/enums/BabyStationStatus.ts` — `EBabyStationStatus { INITIALISING | WAITING | CRY_DETECTED | ERROR }`
  - [x] `src/core/enums/ParentStationStatus.ts` — `EParentStationStatus { DISCOVERING | CONNECTING | CONNECTED | CRY_ALERT | CONNECTION_LOST | DISCONNECTED | ERROR }`
  - [x] `src/core/enums/PermissionStatus.ts` — `EPermissionStatus { CHECKING | ALL_GRANTED | PENDING | PARTIALLY_DENIED | PERMANENTLY_DENIED }`
- [x] Create all entities:
  - [x] `src/core/entities/UserSession.ts` — `userId`, `email`, `accessToken`
  - [x] `src/core/entities/UserProfile.ts` — `userId`, `firstName`, `lastName`, `birthDate`, `mobile`, `gender: EUserGender`, `onboardingComplete`
  - [x] `src/core/entities/BabyProfile.ts` — `babyId`, `userId`, `babyName`, `birthDate`, `gender: EBabyGender`
  - [x] `src/core/entities/CryEvent.ts` — `eventId`, `userId`, `babyId`, `detectedAt`, `confidenceScore`
  - [x] `src/core/entities/DeviceInfo.ts` — `deviceId`, `ipAddress`, `deviceName`, `role: EAppRole`
  - [x] `src/core/entities/TcpMessage.ts` — `type: ETcpMessageType`, `payload?: unknown`, `timestamp: number`
- [x] Create all interfaces:
  - [x] `src/core/interfaces/IAuthService.ts`
  - [x] `src/core/interfaces/IUserProfileRepository.ts`
  - [x] `src/core/interfaces/IBabyProfileRepository.ts`
  - [x] `src/core/interfaces/IEventLogRepository.ts`
  - [x] `src/core/interfaces/IAudioCaptureService.ts`
  - [x] `src/core/interfaces/ICryDetectionService.ts`
  - [x] `src/core/interfaces/ITcpSocketService.ts`
  - [x] `src/core/interfaces/INetworkDiscoveryService.ts`
  - [x] `src/core/interfaces/INotificationService.ts`
  - [x] `src/core/interfaces/IHeartbeatService.ts`
- [x] Create `src/config/serviceTokens.ts` — 10 Symbol tokens
- [x] Create `src/config/container/ServiceContainer.ts` — typed singleton container
- [x] Create `src/config/container/registerServices.ts` — composition root (fills screen by screen)
- [x] Create `src/config/constants.ts`
- [x] Create `src/navigation/AppNavigator.tsx` — three stacks, state-driven routing
- [x] Create `src/application/stores/useAppStore.ts` — base state + setters (actions added per screen)
- [x] Update `App.tsx` — calls `registerAllServices()` then renders `<AppNavigator />`

---

## SCREEN 1 — SplashScreen

> First screen every user sees. Pure routing — no user interaction.

### UI Tasks

- [x] Create `src/ui/atoms/AppText/AppText.interface.ts` — props: `variant: 'heading' | 'body' | 'caption'`, `children`, `style?`
- [x] Create `src/ui/atoms/AppText/AppText.tsx` — base text component with variant-based styles
- [x] Create `src/ui/screens/SplashScreen/SplashScreen.tsx`
  - [x] Center app logo (`assets/logo.png`) using `Image`
  - [x] Show `ActivityIndicator` below logo
  - [x] Full-screen background with brand colour

### Logic Tasks

- [x] Implement `src/infrastructure/supabase/SupabaseAuthService.ts` — implement `restoreSession()` only (returns `UserSession | null`)
- [x] Register `ServiceTokens.AuthService → SupabaseAuthService` in `registerServices.ts`
- [x] Add `appInitialisationStatus: 'LOADING' | 'COMPLETE'` state to `useAppStore`
- [x] Add `initializeAppSession()` action to `useAppStore` — calls `IAuthService.restoreSession()`, sets `isAuthenticated` and `isOnboardingComplete`
- [x] Wire `SplashScreen.tsx` — on mount call `initializeAppSession()`; when `appInitialisationStatus === 'COMPLETE'` navigate via `AppNavigator` state (no manual navigation needed)
- [x] Register `SplashScreen` as initial route of `AuthStack`

---

## SCREEN 2 — LoginScreen

> Returning users sign in here. Entry point of `AuthStack`.

### UI Tasks

- [x] Create `src/ui/atoms/AppTextInput/AppTextInput.interface.ts` — props: `value`, `onChangeText`, `placeholder`, `secureTextEntry?`, `keyboardType?`, `errorMessage?`, `editable?`
- [x] Create `src/ui/atoms/AppTextInput/AppTextInput.tsx` — styled text input, shows `errorMessage` as red text below field when provided
- [x] Create `src/ui/atoms/AppButton/AppButton.interface.ts` — props: `label`, `onPress`, `variant: 'primary' | 'ghost'`, `isLoading?`, `isDisabled?`
- [x] Create `src/ui/atoms/AppButton/AppButton.tsx` — primary (filled) and ghost (outline) variants; shows `ActivityIndicator` inside button when `isLoading === true`; reduced opacity when `isDisabled === true`
- [x] Create `src/ui/organisms/LoginForm/LoginForm.interface.ts` — props: `loginStatus: 'IDLE' | 'LOADING' | 'ERROR'`, `errorMessage`, `onLoginSubmit(email, password)`, `onNavigateToSignUp`
- [x] Create `src/ui/organisms/LoginForm/LoginForm.tsx`
  - [x] "Welcome back" heading using `AppText`
  - [x] Email `AppTextInput`
  - [x] Password `AppTextInput` with `secureTextEntry`
  - [x] "Sign In" `AppButton` (primary) — `isLoading` when `loginStatus === 'LOADING'`, `isDisabled` when loading
  - [x] Inline error `AppText` below button — visible only when `loginStatus === 'ERROR'`
  - [x] "Don't have an account? Sign Up" `AppButton` (ghost) — calls `onNavigateToSignUp`
- [x] Create `src/ui/screens/LoginScreen/LoginScreen.tsx`
  - [x] Renders `LoginForm` organism
  - [x] Passes `loginStatus` and `errorMessage` from `useAppStore` as props to `LoginForm`

### Logic Tasks

- [x] Implement `SupabaseAuthService.signInWithEmailAndPassword(email, password)` — returns `UserSession` on success, throws on failure
- [x] Implement `SupabaseAuthService.signOut()`
- [x] Add `loginStatus: 'IDLE' | 'LOADING' | 'ERROR'` state to `useAppStore`
- [x] Add `loginErrorMessage: string | null` state to `useAppStore`
- [x] Add `handleLoginSubmit(email, password)` action to `useAppStore` — calls `IAuthService.signInWithEmailAndPassword`, on success sets `isAuthenticated` + checks `isOnboardingComplete`, on failure sets `loginStatus` to `'ERROR'` and `loginErrorMessage`
- [x] Wire `LoginScreen.tsx` — pass `handleLoginSubmit` and `() => navigation.navigate('SignUp')` to `LoginForm`
- [x] Register `LoginScreen` in `AuthStack`

---

## SCREEN 3 — SignUpScreen

> New users create an account. Email + password only — profile collected in onboarding.

### UI Tasks

- [x] Create `src/ui/organisms/SignUpForm/SignUpForm.interface.ts` — props: `signUpStatus: 'IDLE' | 'LOADING' | 'ERROR'`, `errorMessage`, `onSignUpSubmit(email, password)`, `onNavigateToLogin`
- [x] Create `src/ui/organisms/SignUpForm/SignUpForm.tsx`
  - [x] "Create your account" heading using `AppText`
  - [x] Email `AppTextInput`
  - [x] Password `AppTextInput` with `secureTextEntry`
  - [x] Confirm Password `AppTextInput` with `secureTextEntry`
  - [x] Client-side password match check — show inline error under confirm field when passwords don't match, do not call `onSignUpSubmit`
  - [x] "Create Account" `AppButton` (primary) — `isLoading` when `signUpStatus === 'LOADING'`
  - [x] Inline API error `AppText` — visible when `signUpStatus === 'ERROR'`
  - [x] "Already have an account? Sign In" `AppButton` (ghost) — calls `onNavigateToLogin`
- [x] Create `src/ui/screens/SignUpScreen/SignUpScreen.tsx`
  - [x] Renders `SignUpForm` organism
  - [x] Passes `signUpStatus` and `signUpErrorMessage` from `useAppStore` as props

### Logic Tasks

- [x] Implement `SupabaseAuthService.signUpWithEmailAndPassword(email, password)` — creates Supabase auth user, returns `UserSession`
- [x] Add `signUpStatus: 'IDLE' | 'LOADING' | 'ERROR'` state to `useAppStore`
- [x] Add `signUpErrorMessage: string | null` state to `useAppStore`
- [x] Add `handleSignUpSubmit(email, password)` action to `useAppStore` — calls `IAuthService.signUpWithEmailAndPassword`, on success sets `isAuthenticated` (triggers `AppNavigator` to show `OnboardingStack`), on failure sets error state
- [x] Wire `SignUpScreen.tsx` — pass `handleSignUpSubmit` and `() => navigation.navigate('Login')` to `SignUpForm`
- [x] Register `SignUpScreen` in `AuthStack`

---

## SCREEN 4 — UserProfileScreen (Onboarding Step 1 of 2)

> Collects parent's personal details. First screen after account creation.

### UI Tasks

- [x] Create `src/ui/molecules/OnboardingProgressBar/OnboardingProgressBar.interface.ts` — props: `currentStep: number`, `totalSteps: number`
- [x] Create `src/ui/molecules/OnboardingProgressBar/OnboardingProgressBar.tsx` — row of `totalSteps` segments; segments up to `currentStep` are filled with brand colour, rest are grey
- [x] Create `src/ui/molecules/DatePickerInput/DatePickerInput.interface.ts` — props: `label`, `value: Date | null`, `onDateChange(date: Date)`, `maximumDate?`, `minimumDate?`, `errorMessage?`
- [x] Create `src/ui/molecules/DatePickerInput/DatePickerInput.tsx` — tappable `AppTextInput` (shows formatted date string) that opens native `DateTimePicker` modal on press; shows `errorMessage` below when provided
- [x] Create `src/ui/molecules/GenderSelector/GenderSelector.interface.ts` — props: `options: { label: string; value: string }[]`, `selectedValue: string | null`, `onSelect(value: string)`, `errorMessage?`
- [x] Create `src/ui/molecules/GenderSelector/GenderSelector.tsx` — horizontal row of `AppButton` (ghost style); selected option gets filled/highlighted style; shows `errorMessage` below when provided
- [x] Create `src/ui/organisms/OnboardingForm/OnboardingForm.interface.ts` — props: all field values + individual `onFieldChange` handlers + `onSubmit` + `saveStatus: 'IDLE' | 'LOADING' | 'ERROR'` + per-field `errorMessages`
- [x] Create `src/ui/organisms/OnboardingForm/OnboardingForm.tsx`
  - [x] First Name `AppTextInput`
  - [x] Last Name `AppTextInput`
  - [x] Date of Birth `DatePickerInput` — `maximumDate` set to today minus 18 years
  - [x] Mobile `AppTextInput` with `keyboardType='phone-pad'`
  - [x] Gender `GenderSelector` — options built from `EUserGender` enum values
  - [x] "Next →" `AppButton` (primary) — `isDisabled` until all fields pass validation, `isLoading` when `saveStatus === 'LOADING'`
- [x] Create `src/ui/screens/UserProfileScreen/UserProfileScreen.tsx`
  - [x] `OnboardingProgressBar` at top — `currentStep={1}` `totalSteps={2}`
  - [x] "Tell us about yourself" `AppText` heading
  - [x] `OnboardingForm` organism
  - [x] Disable hardware back button (user cannot return to `SignUpScreen`)

### Logic Tasks

- [x] Implement `src/infrastructure/supabase/SupabaseUserProfileRepository.ts`
  - [x] `saveUserProfile(profile: UserProfile): Promise<void>` — upsert to `user_profiles` table
  - [x] `getUserProfile(userId: string): Promise<UserProfile | null>`
  - [x] `markOnboardingComplete(userId: string): Promise<void>` — sets `onboardingComplete = true`
  - [x] `isOnboardingComplete(userId: string): Promise<boolean>`
- [x] Register `ServiceTokens.UserProfileRepository → SupabaseUserProfileRepository` in `registerServices.ts`
- [x] Create `src/application/stores/useOnboardingStore.ts`
  - [x] State: `userProfileFormData: Partial<UserProfile>`, `saveUserProfileStatus: 'IDLE' | 'LOADING' | 'ERROR'`, `userProfileErrorMessage: string | null`
  - [x] State: `babyProfileFormData: Partial<BabyProfile>`, `saveBabyProfileStatus: 'IDLE' | 'LOADING' | 'ERROR'`, `babyProfileErrorMessage: string | null`
  - [x] Action: `updateUserProfileField(field, value)` — updates `userProfileFormData`
  - [x] Action: `saveUserProfile()` — validates all fields (min length, 18+ age, phone format), calls `IUserProfileRepository.saveUserProfile`, on success sets status to `'IDLE'`
- [x] Add field-level validation rules (pure functions, no side effects):
  - [x] `validateFirstName` — min 2 chars, letters only
  - [x] `validateLastName` — min 2 chars, letters only
  - [x] `validateBirthDate` — user must be 18 or older
  - [x] `validateMobile` — valid phone number format
  - [x] `validateUserGender` — must be a valid `UserGender` enum value
- [x] Wire `UserProfileScreen.tsx` — reads form data + status from `useOnboardingStore`; on save success navigate to `BabyProfile`
- [x] Register `UserProfileScreen` as initial route of `OnboardingStack`

---

## SCREEN 5 — BabyProfileScreen (Onboarding Step 2 of 2)

> Collects baby's details. Completing this screen marks onboarding as done.

### UI Tasks

- [x] Create `src/ui/organisms/BabyProfileForm/BabyProfileForm.interface.ts` — props: all field values + `onFieldChange` handlers + `onSubmit` + `saveStatus: 'IDLE' | 'LOADING' | 'ERROR'` + per-field `errorMessages`
- [x] Create `src/ui/organisms/BabyProfileForm/BabyProfileForm.tsx`
  - [x] Baby Name `AppTextInput`
  - [x] Date of Birth `DatePickerInput` — `minimumDate` set to today minus 5 years, `maximumDate` set to today
  - [x] Gender `GenderSelector` — options built from `EBabyGender` enum (`BOY | GIRL | PREFER_NOT_TO_SAY`)
  - [x] "Done →" `AppButton` (primary) — `isDisabled` until all fields valid, `isLoading` when `saveStatus === 'LOADING'`
- [x] Create `src/ui/screens/BabyProfileScreen/BabyProfileScreen.tsx`
  - [x] `OnboardingProgressBar` at top — `currentStep={2}` `totalSteps={2}`
  - [x] "Now, tell us about your baby" `AppText` heading
  - [x] `BabyProfileForm` organism
  - [x] Back navigation allowed — hardware back and back button navigate to `UserProfileScreen`

### Logic Tasks

- [x] Implement `src/infrastructure/supabase/SupabaseBabyProfileRepository.ts`
  - [x] `saveBabyProfile(profile: BabyProfile): Promise<void>` — upsert to `baby_profiles` table
  - [x] `getBabyProfile(userId: string): Promise<BabyProfile | null>`
- [x] Register `ServiceTokens.BabyProfileRepository → SupabaseBabyProfileRepository` in `registerServices.ts`
- [x] Add `updateBabyProfileField(field, value)` action to `useOnboardingStore`
- [x] Add `saveBabyProfile()` action to `useOnboardingStore` — validates fields, calls `IBabyProfileRepository.saveBabyProfile`, then calls `IUserProfileRepository.markOnboardingComplete`
- [x] Add field-level validation rules:
  - [x] `validateBabyName` — min 2 chars
  - [x] `validateBabyBirthDate` — not in future, not older than 5 years
  - [x] `validateBabyGender` — must be a valid `BabyGender` enum value
- [x] Add `setOnboardingComplete(value: boolean)` action to `useAppStore`
- [x] Wire `BabyProfileScreen.tsx` — on save success call `useAppStore.setOnboardingComplete(true)` (triggers `AppNavigator` to switch to `AppStack`) then navigate to `RoleSelection`
- [x] Register `BabyProfileScreen` in `OnboardingStack`

---

## SCREEN 6 — RoleSelectionScreen

> User picks which role this device plays for the current session.

### UI Tasks

- [ ] Create `src/ui/atoms/AppIcon/AppIcon.interface.ts` — props: `name: string`, `size?: number`, `color?: string`
- [ ] Create `src/ui/atoms/AppIcon/AppIcon.tsx` — wraps `@expo/vector-icons` (Ionicons)
- [ ] Create `src/ui/molecules/RoleSelectionCard/RoleSelectionCard.interface.ts` — props: `role: EAppRole`, `title: string`, `description: string`, `iconName: string`, `isSelected: boolean`, `onSelect(role: EAppRole)`
- [ ] Create `src/ui/molecules/RoleSelectionCard/RoleSelectionCard.tsx`
  - [ ] Full card is tappable — calls `onSelect` on press
  - [ ] `AppIcon` + `AppText` title + `AppText` description stacked vertically
  - [ ] When `isSelected === true`: highlighted border + tinted background
  - [ ] When `isSelected === false`: neutral border + white background
- [ ] Create `src/ui/screens/RoleSelectionScreen/RoleSelectionScreen.tsx`
  - [ ] "Hi [firstName]! Which device is this?" `AppText` heading — reads `userProfile.firstName` from `useAppStore`
  - [ ] Two `RoleSelectionCard` molecules — Baby Station (baby icon) and Parent Station (headphones icon)
  - [ ] "Continue" `AppButton` (primary) — `isDisabled` when `selectedRole === null`
  - [ ] On "Continue" tap → navigate to `Permissions`

### Logic Tasks

- [ ] Add `selectedRole: EAppRole | null` state to `useAppStore`
- [ ] Add `setSelectedRole(role: EAppRole)` action to `useAppStore`
- [ ] Wire `RoleSelectionScreen.tsx` — reads `selectedRole` and `userProfile` from `useAppStore`, calls `setSelectedRole` on card tap
- [ ] Register `RoleSelectionScreen` as initial route of `AppStack`

---

## SCREEN 7 — PermissionsScreen

> Requests all native permissions required for the selected role. Auto-skips if already granted.

### UI Tasks

- [ ] Create `src/ui/atoms/StatusIndicator/StatusIndicator.interface.ts` — props: `status: 'GRANTED' | 'DENIED' | 'PENDING'`, `size?: number`
- [ ] Create `src/ui/atoms/StatusIndicator/StatusIndicator.tsx` — filled circle: green for `GRANTED`, red for `DENIED`, grey for `PENDING`
- [ ] Create `src/ui/molecules/PermissionRow/PermissionRow.interface.ts` — props: `iconName: string`, `permissionName: string`, `reason: string`, `status: 'GRANTED' | 'DENIED' | 'PENDING'`
- [ ] Create `src/ui/molecules/PermissionRow/PermissionRow.tsx`
  - [ ] `AppIcon` on left
  - [ ] `AppText` permission name (bold) + `AppText` reason stacked in centre
  - [ ] `StatusIndicator` on right
- [ ] Create `src/ui/screens/PermissionsScreen/PermissionsScreen.tsx`
  - [ ] "CryGuard needs a few permissions" `AppText` heading
  - [ ] Render one `PermissionRow` per required permission (list is role-aware — different for Baby vs Parent)
  - [ ] "Grant Permissions" `AppButton` (primary) — visible when `permissionCheckStatus === 'pending' | 'partially_denied'`
  - [ ] "Open Settings" `AppButton` (primary) — visible when `permissionCheckStatus === 'permanently_denied'`; tapping deep-links to OS app settings
  - [ ] No button shown when `permissionCheckStatus === 'checking'` — show `ActivityIndicator` instead

### Logic Tasks

- [ ] Add `permissionCheckStatus: EPermissionStatus` state to `useAppStore`
- [ ] Add `permissionStatuses: Record<string, 'GRANTED' | 'DENIED' | 'PENDING'>` state to `useAppStore`
- [ ] Add `checkAndRequestPermissions(role: EAppRole)` action to `useAppStore`
  - [ ] Baby Station requires: Microphone, Local Network, Battery Optimisation
  - [ ] Parent Station requires: Local Network, Notifications, Battery Optimisation
  - [ ] Check each permission status using `expo-notifications` and `expo-av` APIs
  - [ ] Request any pending permissions in sequence
  - [ ] Update `permissionStatuses` and `permissionCheckStatus` accordingly
- [ ] Add `openDeviceSettings()` action to `useAppStore` — calls `Linking.openSettings()`
- [ ] Wire `PermissionsScreen.tsx`
  - [ ] On mount: call `checkAndRequestPermissions(selectedRole)`
  - [ ] When `permissionCheckStatus === 'all_granted'`: auto-navigate to `BabyStation` or `ParentStation` based on `selectedRole`
- [ ] Register `PermissionsScreen` in `AppStack`

---

## SCREEN 8 — BabyStationScreen

> The device placed in the baby's room. Mic live, AI running, TCP server open, heartbeat broadcasting.

### UI Tasks

- [ ] Create `src/ui/molecules/ConnectionStatusBar/ConnectionStatusBar.interface.ts` — props: `connectionStatus: EConnectionStatus`, `remoteDeviceLabel: string`
- [ ] Create `src/ui/molecules/ConnectionStatusBar/ConnectionStatusBar.tsx`
  - [ ] `StatusIndicator` atom on left (colour maps to `ConnectionStatus`)
  - [ ] `AppText` showing `remoteDeviceLabel` and status text (e.g. "Parent connected", "Waiting for parent...")
- [ ] Create `src/ui/molecules/HeartbeatPulse/HeartbeatPulse.interface.ts` — props: `lastEventAt: number | null`, `label: string`
- [ ] Create `src/ui/molecules/HeartbeatPulse/HeartbeatPulse.tsx`
  - [ ] Pulsing animated `AppIcon` (heart icon) using `Animated.loop`
  - [ ] `AppText` showing "label Xs ago" — updates every second via `setInterval`
- [ ] Create `src/ui/organisms/BabyStationDashboard/BabyStationDashboard.interface.ts` — props: `babyStationStatus: EBabyStationStatus`, `connectionStatus: EConnectionStatus`, `lastHeartbeatSentAt: number | null`, `babyName: string`, `onStopMonitoring: () => void`
- [ ] Create `src/ui/organisms/BabyStationDashboard/BabyStationDashboard.tsx`
  - [ ] `ConnectionStatusBar` molecule at top — label: "Parent Station"
  - [ ] `HeartbeatPulse` molecule — label: "Heartbeat sent"
  - [ ] Large `StatusIndicator` atom in centre — green + "Listening..." when `EBabyStationStatus.WAITING`; red + "CRY DETECTED" when `EBabyStationStatus.CRY_DETECTED`
  - [ ] `AppText` — "Monitoring [babyName]"
  - [ ] "Stop Monitoring" `AppButton` (ghost, red) at bottom — calls `onStopMonitoring`
- [ ] Create `src/ui/screens/BabyStationScreen/BabyStationScreen.tsx`
  - [ ] Renders `BabyStationDashboard` organism
  - [ ] Reads all state from `useBabyStationStore`
  - [ ] Disable hardware back gesture

### Logic Tasks

- [ ] Implement `src/infrastructure/audio/ExpoAudioCaptureService.ts`
  - [ ] `startCapture()` — record mono 16kHz audio using `expo-av`
  - [ ] `stopCapture()`
  - [ ] `onAudioFrame(callback)` — fires callback with raw PCM buffer; applies volume gate using `AUDIO_VOLUME_GATE_THRESHOLD` constant before firing
- [ ] Register `ServiceTokens.AudioCaptureService → ExpoAudioCaptureService` in `registerServices.ts`
- [ ] Add YAMNet `.tflite` model file to `src/infrastructure/ai/models/yamnet.tflite`
- [ ] Implement `src/infrastructure/ai/YamNetTfliteService.ts`
  - [ ] `loadModel()` — load bundled `.tflite` via `@tensorflow/tfjs-react-native`
  - [ ] `classifyAudioFrame(pcmBuffer)` — run inference, return class confidence scores
  - [ ] `isCrying(pcmBuffer)` — returns `true` if "Baby Crying" class confidence exceeds `CRY_CONFIDENCE_THRESHOLD`
- [ ] Register `ServiceTokens.CryDetectionService → YamNetTfliteService` in `registerServices.ts`
- [ ] Implement `src/infrastructure/tcp/TcpSocketService.ts`
  - [ ] `startServer(port)` — open TCP server using `react-native-tcp-socket`
  - [ ] `connectToServer(ip, port)` — connect as TCP client
  - [ ] `sendMessage(message: TcpMessage)` — JSON-serialise and send
  - [ ] `onMessage(callback)` — deserialise incoming JSON, fire callback with typed `TcpMessage`
  - [ ] `disconnect()` — close socket cleanly
- [ ] Register `ServiceTokens.TcpSocketService → TcpSocketService` in `registerServices.ts`
- [ ] Implement `src/infrastructure/discovery/ZeroconfDiscoveryService.ts`
  - [ ] `advertise(serviceName, port)` — broadcast mDNS using `react-native-zeroconf`
  - [ ] `discover(serviceName)` — scan for mDNS service, resolve to IP
  - [ ] `stopAdvertising()`, `stopDiscovery()`
- [ ] Register `ServiceTokens.NetworkDiscoveryService → ZeroconfDiscoveryService` in `registerServices.ts`
- [ ] Implement `src/infrastructure/supabase/SupabaseEventLogRepository.ts`
  - [ ] `logCryEvent(event: CryEvent): Promise<void>` — insert to `cry_events` table
  - [ ] `getCryEventsForToday(userId: string): Promise<CryEvent[]>`
- [ ] Register `ServiceTokens.EventLogRepository → SupabaseEventLogRepository` in `registerServices.ts`
- [ ] Create `src/application/useCases/DetectCryUseCase.ts`
  - [ ] Resolves `IAudioCaptureService` + `ICryDetectionService` from container
  - [ ] `startDetection(onCryDetected: (confidenceScore: number) => void)` — starts audio capture, pipes frames through AI gate, fires callback when cry confirmed
  - [ ] `stopDetection()`
- [ ] Create `src/application/useCases/LogCryEventUseCase.ts`
  - [ ] Resolves `IEventLogRepository` from container
  - [ ] `execute(userId, babyId, confidenceScore)` — builds `CryEvent` entity, calls `IEventLogRepository.logCryEvent`
- [ ] Create `src/application/useCases/StartBabyStationUseCase.ts`
  - [ ] Resolves `ITcpSocketService` + `INetworkDiscoveryService` from container
  - [ ] `execute(onParentConnected, onParentDisconnected)` — advertise mDNS, start TCP server, start heartbeat interval (`HEARTBEAT_INTERVAL_MS`)
  - [ ] `stop()` — stop heartbeat, close TCP server, stop mDNS advertising
- [ ] Create `src/application/stores/useBabyStationStore.ts`
  - [ ] State: `babyStationStatus: EBabyStationStatus`, `connectionStatus: EConnectionStatus`, `lastHeartbeatSentAt: number | null`, `cryEventCount: number`
  - [ ] Action: `startMonitoring()` — calls `StartBabyStationUseCase.execute()` then `DetectCryUseCase.startDetection()`
  - [ ] Action: `stopMonitoring()` — calls `StartBabyStationUseCase.stop()` then `DetectCryUseCase.stopDetection()`
  - [ ] Action: `handleCryDetected(confidenceScore)` — calls `ITcpSocketService.sendMessage({ type: ETcpMessageType.CRY_ALERT })`, calls `LogCryEventUseCase.execute()`, sets `babyStationStatus` to `EBabyStationStatus.CRY_DETECTED`, increments `cryEventCount`
  - [ ] Action: `handleHeartbeatSent()` — updates `lastHeartbeatSentAt`
- [ ] Wire `BabyStationScreen.tsx`
  - [ ] On mount: call `useBabyStationStore.startMonitoring()`
  - [ ] On unmount: call `useBabyStationStore.stopMonitoring()`
  - [ ] "Stop Monitoring" → `stopMonitoring()` → navigate to `RoleSelection`
- [ ] Register `BabyStationScreen` in `AppStack`

---

## SCREEN 9 — ParentStationScreen

> The parent's device. Connects to Baby Station, monitors heartbeat, triggers alarm on cry.

### UI Tasks

- [ ] Create `src/ui/molecules/CryAlertBanner/CryAlertBanner.interface.ts` — props: `isVisible: boolean`, `babyName: string`
- [ ] Create `src/ui/molecules/CryAlertBanner/CryAlertBanner.tsx`
  - [ ] Full-screen red overlay using `Modal` or absolute-positioned `View`
  - [ ] Pulsing siren `AppIcon` (large, white) using `Animated.loop`
  - [ ] "BABY IS CRYING" `AppText` (large, white, bold)
  - [ ] "[babyName] needs you!" `AppText` (white)
  - [ ] Only rendered when `isVisible === true`
- [ ] Create `src/ui/organisms/EventHistoryList/EventHistoryList.interface.ts` — props: `cryEvents: CryEvent[]`
- [ ] Create `src/ui/organisms/EventHistoryList/EventHistoryList.tsx`
  - [ ] `FlatList` of cry events
  - [ ] Each row: time of event (`AppText`) + confidence score as percentage (`AppText`)
  - [ ] Empty state: "No cry events today" `AppText`
- [ ] Create `src/ui/organisms/ParentStationDashboard/ParentStationDashboard.interface.ts` — props: `parentStationStatus: EParentStationStatus`, `connectionStatus: EConnectionStatus`, `lastHeartbeatReceivedAt: number | null`, `babyName: string`, `todayCryEvents: CryEvent[]`, `onDisconnect: () => void`
- [ ] Create `src/ui/organisms/ParentStationDashboard/ParentStationDashboard.tsx`
  - [ ] `ConnectionStatusBar` molecule at top — label: "Baby Station"
  - [ ] `CryAlertBanner` molecule — `isVisible` when `parentStationStatus === EParentStationStatus.CRY_ALERT`
  - [ ] `HeartbeatPulse` molecule — label: "Last heartbeat"
  - [ ] `AppText` — "Listening for [babyName]"
  - [ ] `EventHistoryList` organism — today's cry events
  - [ ] "Disconnect" `AppButton` (ghost, red) at bottom — calls `onDisconnect`
- [ ] Create `src/ui/screens/ParentStationScreen/ParentStationScreen.tsx`
  - [ ] Renders `ParentStationDashboard` organism
  - [ ] Reads all state from `useParentStationStore`
  - [ ] Disable hardware back gesture

### Logic Tasks

- [ ] Implement `src/infrastructure/notifications/ExpoNotificationService.ts`
  - [ ] `triggerAlarm()` — schedule high-priority local notification with siren sound; set `AVAudioSession` category to `playback` (iOS) and use `AudioManager.STREAM_ALARM` (Android) to override silent mode
  - [ ] `stopAlarm()`
  - [ ] `triggerConnectionLostAlert()` — schedule local notification "Monitor connection lost"
- [ ] Register `ServiceTokens.NotificationService → ExpoNotificationService` in `registerServices.ts`
- [ ] Create `src/application/useCases/MonitorHeartbeatUseCase.ts`
  - [ ] Resolves `INotificationService` from container
  - [ ] `startMonitoring(onConnectionLost: () => void)` — starts countdown timer; if `MISSED_HEARTBEAT_LIMIT` consecutive beats missed, fires `onConnectionLost` and calls `INotificationService.triggerConnectionLostAlert()`
  - [ ] `resetTimer()` — called on every received heartbeat, resets countdown
  - [ ] `stopMonitoring()` — clears timer
- [ ] Create `src/application/useCases/StartParentStationUseCase.ts`
  - [ ] Resolves `ITcpSocketService` + `INetworkDiscoveryService` from container
  - [ ] `execute(onCryAlert, onHeartbeat, onConnectionLost)` — discover Baby Station via mDNS, connect TCP, wire `onMessage` to dispatch to correct callback by `TcpMessageType`
  - [ ] `stop()` — disconnect TCP, stop mDNS discovery
- [ ] Create `src/application/stores/useParentStationStore.ts`
  - [ ] State: `parentStationStatus: EParentStationStatus`, `connectionStatus: EConnectionStatus`, `lastHeartbeatReceivedAt: number | null`, `todayCryEvents: CryEvent[]`
  - [ ] Action: `startListening()` — calls `StartParentStationUseCase.execute()` + `MonitorHeartbeatUseCase.startMonitoring()`, loads today's events via `IEventLogRepository.getCryEventsForToday`
  - [ ] Action: `stopListening()` — calls `StartParentStationUseCase.stop()` + `MonitorHeartbeatUseCase.stopMonitoring()`
  - [ ] Action: `handleCryAlertReceived()` — calls `INotificationService.triggerAlarm()`, sets `parentStationStatus` to `EParentStationStatus.CRY_ALERT`
  - [ ] Action: `handleHeartbeatReceived()` — calls `MonitorHeartbeatUseCase.resetTimer()`, updates `lastHeartbeatReceivedAt`
  - [ ] Action: `handleConnectionLost()` — sets `parentStationStatus` to `EParentStationStatus.CONNECTION_LOST`, sets `connectionStatus` to `EConnectionStatus.LOST`
- [ ] Wire `ParentStationScreen.tsx`
  - [ ] On mount: call `useParentStationStore.startListening()`
  - [ ] On unmount: call `useParentStationStore.stopListening()`
  - [ ] "Disconnect" → `stopListening()` → navigate to `RoleSelection`
- [ ] Register `ParentStationScreen` in `AppStack`

---

## PHASE 10 — Cross-Cutting Concerns

> Not tied to a single screen. Complete after all screens are working.

### Background Persistence (Android)

- [ ] Configure Android Foreground Service in `app.json` and native `AndroidManifest.xml`
- [ ] Verify `ExpoAudioCaptureService` and `TcpSocketService` survive screen-off on Android
- [ ] Add `expo-keep-awake` call in `BabyStationScreen` to prevent CPU sleep during monitoring

### Volume Override (Parent Alarm)

- [ ] Verify `ExpoNotificationService.triggerAlarm()` plays audio when device is on silent (Android `STREAM_ALARM`, iOS `AVAudioSession` playback category)
- [ ] Test alarm override on both platforms with device on silent and DND

### Auth Edge Cases

- [ ] Handle Supabase session expiry mid-session — auto sign-out + reset navigator to `AuthStack`
- [ ] Handle network unavailable during login/signup — show "No internet connection" error
- [ ] Handle Supabase unavailable during cry event logging — queue event locally, retry on reconnect

### Final Integration Checks

- [ ] End-to-end: Baby Station detects cry → Parent Station alarm rings within target latency
- [ ] Heartbeat fail-safe: kill Baby Station app → Parent Station shows "Connection Lost" after 20s
- [ ] Cry events appear in Supabase `cry_events` table after detection
- [ ] `EventHistoryList` on Parent Station shows today's events correctly
- [ ] Onboarding data persists correctly in `user_profiles` and `baby_profiles` tables
- [ ] Cold start with valid session skips auth and onboarding, lands on `RoleSelectionScreen`
- [ ] Cold start with no session lands on `LoginScreen`
- [ ] Cold start with session but incomplete onboarding lands on `UserProfileScreen`
