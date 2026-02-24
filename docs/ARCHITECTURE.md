# CryGuard — Architecture Document

**Version:** 2.0
**Status:** Approved

---

## 1. Core Philosophy

Three non-negotiable pillars:

- **Layered Architecture** — strict inward-only dependency rule across 4 layers.
- **Atomic Design** — UI built as atoms → molecules → organisms → screens.
- **Loose Coupling via DI Container** — every service is registered by a token and resolved through a central `ServiceContainer`. No layer ever `import`s a concrete class from another layer directly.

> Components are dumb. Use cases are logic. Infrastructure is swappable. The container is the only place that knows about concrete implementations.

---

## 2. Folder Structure

```
src/
├── core/                                   # Layer 1 — Domain (innermost, zero external deps)
│   ├── interfaces/                         # Abstract contracts (ports) — the only thing other layers depend on
│   │   ├── IAuthService.ts
│   │   ├── IAudioCaptureService.ts
│   │   ├── ICryDetectionService.ts
│   │   ├── IEventLogRepository.ts
│   │   ├── IHeartbeatService.ts
│   │   ├── INetworkDiscoveryService.ts
│   │   ├── INotificationService.ts
│   │   ├── ITcpSocketService.ts
│   │   ├── IUserProfileRepository.ts       # saveUserProfile, getUserProfile, markOnboardingComplete
│   │   └── IBabyProfileRepository.ts       # saveBabyProfile, getBabyProfile
│   ├── entities/                           # Pure domain models — plain TypeScript, no framework imports
│   │   ├── CryEvent.ts
│   │   ├── DeviceInfo.ts
│   │   ├── UserSession.ts
│   │   ├── UserProfile.ts                  # firstName, lastName, birthDate, mobile, gender, onboardingComplete
│   │   └── BabyProfile.ts                  # babyName, birthDate, gender
│   └── enums/                              # Shared domain enums
│       ├── AppRole.ts
│       ├── ConnectionStatus.ts
│       ├── TcpMessageType.ts
│       ├── UserGender.ts                   # Male | Female | PreferNotToSay
│       └── BabyGender.ts                   # Boy | Girl | PreferNotToSay
│
├── application/                            # Layer 2 — Use Cases + State
│   ├── useCases/
│   │   ├── StartBabyStationUseCase.ts      # depends on ITcpSocketService, INetworkDiscoveryService
│   │   ├── StartParentStationUseCase.ts    # depends on ITcpSocketService, INetworkDiscoveryService
│   │   ├── DetectCryUseCase.ts             # depends on IAudioCaptureService, ICryDetectionService
│   │   ├── LogCryEventUseCase.ts           # depends on IEventLogRepository
│   │   └── MonitorHeartbeatUseCase.ts      # depends on ITcpSocketService, INotificationService
│   └── stores/                             # Zustand stores — UI state only, call use cases for logic
│       ├── useAppStore.ts
│       ├── useOnboardingStore.ts           # drives UserProfileScreen + BabyProfileScreen
│       ├── useBabyStationStore.ts
│       └── useParentStationStore.ts
│
├── infrastructure/                         # Layer 3 — Concrete implementations of core interfaces
│   ├── supabase/
│   │   ├── supabaseClient.ts
│   │   ├── SupabaseAuthService.ts              # implements IAuthService
│   │   ├── SupabaseEventLogRepository.ts       # implements IEventLogRepository
│   │   ├── SupabaseUserProfileRepository.ts    # implements IUserProfileRepository
│   │   └── SupabaseBabyProfileRepository.ts    # implements IBabyProfileRepository
│   ├── tcp/
│   │   └── TcpSocketService.ts             # implements ITcpSocketService
│   ├── discovery/
│   │   └── ZeroconfDiscoveryService.ts     # implements INetworkDiscoveryService
│   ├── audio/
│   │   └── ExpoAudioCaptureService.ts      # implements IAudioCaptureService
│   ├── notifications/
│   │   └── ExpoNotificationService.ts      # implements INotificationService
│   └── ai/
│       ├── YamNetTfliteService.ts          # implements ICryDetectionService
│       └── models/                         # bundled .tflite model file
│
├── ui/                                     # Layer 4 — Presentation (Atomic Design)
│   ├── atoms/
│   │   ├── AppText/
│   │   ├── AppButton/
│   │   ├── AppIcon/
│   │   └── StatusIndicator/
│   ├── molecules/
│   │   ├── HeartbeatPulse/
│   │   ├── CryAlertBanner/
│   │   ├── ConnectionStatusBar/
│   │   ├── RoleSelectionCard/
│   │   ├── DatePickerInput/
│   │   ├── GenderSelector/
│   │   ├── OnboardingProgressBar/
│   │   └── PermissionRow/
│   ├── organisms/
│   │   ├── BabyStationDashboard/
│   │   ├── ParentStationDashboard/
│   │   ├── LoginForm/
│   │   ├── SignUpForm/
│   │   ├── OnboardingForm/
│   │   ├── BabyProfileForm/
│   │   └── EventHistoryList/
│   └── screens/
│       ├── SplashScreen/
│       ├── LoginScreen/
│       ├── SignUpScreen/
│       ├── UserProfileScreen/
│       ├── BabyProfileScreen/
│       ├── RoleSelectionScreen/
│       ├── PermissionsScreen/
│       ├── BabyStationScreen/
│       └── ParentStationScreen/
│
└── navigation/
    └── AppNavigator.tsx                    # switches between AuthStack, OnboardingStack, AppStack
│
└── config/
    ├── constants.ts
    ├── serviceTokens.ts                    # Symbol tokens — the "keys" for the DI container
    └── container/
        ├── ServiceContainer.ts             # The DI container implementation
        └── registerServices.ts             # Composition root — registers all bindings, called once at startup
```

---

## 3. Layered Architecture (Dependency Rule)

Dependencies only point **inward**. Outer layers know about inner layers. Inner layers know nothing about outer layers.

```
┌──────────────────────────────────────────────────────┐
│   UI  (screens, organisms, molecules, atoms)          │
│   → reads from: application/stores                   │
│   → never imports: infrastructure or core directly   │
├──────────────────────────────────────────────────────┤
│   Application  (use cases, stores)                    │
│   → depends on: core/interfaces (via tokens)         │
│   → never imports: infrastructure                    │
├──────────────────────────────────────────────────────┤
│   Infrastructure  (concrete service implementations)  │
│   → implements: core/interfaces                      │
│   → registered in: config/container/registerServices │
├──────────────────────────────────────────────────────┤
│   Core  (interfaces, entities, enums)                 │
│   → depends on: nothing external                     │
└──────────────────────────────────────────────────────┘
```

---

## 4. Loose Coupling — The DI Container

### 4.1 Service Tokens (`config/serviceTokens.ts`)

Tokens are `Symbol`s used as keys. They are the only thing use cases and stores import to request a dependency. No concrete class name ever appears outside `registerServices.ts`.

```typescript
// config/serviceTokens.ts
const ServiceTokens = {
  AuthService: Symbol("IAuthService"),
  AudioCaptureService: Symbol("IAudioCaptureService"),
  CryDetectionService: Symbol("ICryDetectionService"),
  EventLogRepository: Symbol("IEventLogRepository"),
  HeartbeatService: Symbol("IHeartbeatService"),
  NetworkDiscoveryService: Symbol("INetworkDiscoveryService"),
  NotificationService: Symbol("INotificationService"),
  TcpSocketService: Symbol("ITcpSocketService"),
  UserProfileRepository: Symbol("IUserProfileRepository"),
  BabyProfileRepository: Symbol("IBabyProfileRepository"),
} as const;

export default ServiceTokens;
```

### 4.2 The Container (`config/container/ServiceContainer.ts`)

A lightweight, typed container. No third-party DI library — keeps the bundle lean and avoids decorator/reflect-metadata overhead on React Native.

```typescript
// config/container/ServiceContainer.ts
type ServiceFactory<T> = () => T;

class ServiceContainer {
  private readonly singletonRegistry = new Map<symbol, unknown>();
  private readonly factoryRegistry = new Map<symbol, ServiceFactory<unknown>>();

  registerSingleton<T>(token: symbol, factory: ServiceFactory<T>): void {
    this.factoryRegistry.set(token, factory as ServiceFactory<unknown>);
  }

  resolve<T>(token: symbol): T {
    if (this.singletonRegistry.has(token)) {
      return this.singletonRegistry.get(token) as T;
    }
    const factory = this.factoryRegistry.get(token);
    if (!factory) {
      throw new Error(
        `ServiceContainer: No registration found for token ${token.toString()}`,
      );
    }
    const serviceInstance = factory() as T;
    this.singletonRegistry.set(token, serviceInstance);
    return serviceInstance;
  }
}

export const applicationContainer = new ServiceContainer();
```

### 4.3 Composition Root (`config/container/registerServices.ts`)

The **only** file that imports concrete infrastructure classes. Called once in `App.tsx` before the navigator mounts.

```typescript
// config/container/registerServices.ts
import { applicationContainer } from "./ServiceContainer";
import ServiceTokens from "@config/serviceTokens";

// Infrastructure imports — ONLY allowed in this file
import { SupabaseAuthService } from "@infrastructure/supabase/SupabaseAuthService";
import { SupabaseEventLogRepository } from "@infrastructure/supabase/SupabaseEventLogRepository";
import { TcpSocketService } from "@infrastructure/tcp/TcpSocketService";
import { ZeroconfDiscoveryService } from "@infrastructure/discovery/ZeroconfDiscoveryService";
import { ExpoAudioCaptureService } from "@infrastructure/audio/ExpoAudioCaptureService";
import { ExpoNotificationService } from "@infrastructure/notifications/ExpoNotificationService";
import { YamNetTfliteService } from "@infrastructure/ai/YamNetTfliteService";

export function registerAllServices(): void {
  applicationContainer.registerSingleton(
    ServiceTokens.AuthService,
    () => new SupabaseAuthService(),
  );
  applicationContainer.registerSingleton(
    ServiceTokens.EventLogRepository,
    () => new SupabaseEventLogRepository(),
  );
  applicationContainer.registerSingleton(
    ServiceTokens.TcpSocketService,
    () => new TcpSocketService(),
  );
  applicationContainer.registerSingleton(
    ServiceTokens.NetworkDiscoveryService,
    () => new ZeroconfDiscoveryService(),
  );
  applicationContainer.registerSingleton(
    ServiceTokens.AudioCaptureService,
    () => new ExpoAudioCaptureService(),
  );
  applicationContainer.registerSingleton(
    ServiceTokens.NotificationService,
    () => new ExpoNotificationService(),
  );
  applicationContainer.registerSingleton(
    ServiceTokens.CryDetectionService,
    () => new YamNetTfliteService(),
  );
}
```

### 4.4 How a Use Case Resolves Its Dependencies

```typescript
// application/useCases/DetectCryUseCase.ts
import { applicationContainer } from "@config/container/ServiceContainer";
import ServiceTokens from "@config/serviceTokens";
import type { IAudioCaptureService } from "@core/interfaces/IAudioCaptureService";
import type { ICryDetectionService } from "@core/interfaces/ICryDetectionService";

export class DetectCryUseCase {
  private readonly audioCaptureService: IAudioCaptureService;
  private readonly cryDetectionService: ICryDetectionService;

  constructor() {
    this.audioCaptureService =
      applicationContainer.resolve<IAudioCaptureService>(
        ServiceTokens.AudioCaptureService,
      );
    this.cryDetectionService =
      applicationContainer.resolve<ICryDetectionService>(
        ServiceTokens.CryDetectionService,
      );
  }

  async startDetection(): Promise<void> {
    // business logic only — no concrete class names, no imports from infrastructure
  }
}
```

---

## 5. Atomic Design (UI Layer)

| Level        | Rule                                                               | Examples                                  |
| ------------ | ------------------------------------------------------------------ | ----------------------------------------- |
| **Atom**     | Single-purpose, no logic, no store access                          | `AppText`, `AppButton`, `StatusIndicator` |
| **Molecule** | Combines 2–3 atoms, local UI state only                            | `CryAlertBanner`, `HeartbeatPulse`        |
| **Organism** | Feature-complete block, reads from Zustand store                   | `BabyStationDashboard`, `LoginForm`       |
| **Screen**   | Composes organisms, owns navigation params, triggers store actions | `BabyStationScreen`, `LoginScreen`        |

Each component lives in its own folder:

```
ui/atoms/AppButton/
├── AppButton.tsx
└── AppButton.interface.ts
```

---

## 6. Data Flow

### Baby Station (Transmitter)

```
Microphone
  → IAudioCaptureService (volume gate)
  → ICryDetectionService (YAMNet, confidence threshold)
  → DetectCryUseCase
      → ITcpSocketService.sendCryAlert()
      → LogCryEventUseCase → IEventLogRepository (Supabase)
```

### Parent Station (Receiver)

```
ITcpSocketService.onMessage()
  → TcpMessageType.CryAlert   → INotificationService.triggerAlarm()
  → TcpMessageType.Heartbeat  → MonitorHeartbeatUseCase.resetTimer()
  → [2 missed heartbeats]     → INotificationService.triggerConnectionLostAlert()
```

### Device Discovery

```
Baby Station  → INetworkDiscoveryService.advertise() → ITcpSocketService.startServer()
Parent Station → INetworkDiscoveryService.discover() → ITcpSocketService.connectToServer(ip)
```

---

## 7. TCP Message Protocol

```typescript
// core/enums/TcpMessageType.ts
enum ETcpMessageType {
  HEARTBEAT = "HEARTBEAT",
  CRY_ALERT = "CRY_ALERT",
  ACK = "ACK",
}
```

All TCP messages are JSON: `{ type: ETcpMessageType; payload?: unknown; timestamp: number }`.

---

## 8. State Management

Zustand stores in `application/stores/`:

- Hold UI-relevant state only (connection status, cry events, selected role).
- Instantiate and call use cases for all side effects.
- Resolve use cases via `applicationContainer` — never import infrastructure directly.

---

## 9. App Startup Sequence

```
App.tsx
  1. registerAllServices()          ← composition root, runs before anything else
  2. <AppNavigator />               ← mounts navigation
       → SplashScreen → LoginScreen → RoleSelectionScreen → PermissionsScreen
           → BabyStationScreen | ParentStationScreen
```

Full screen-by-screen specification, state tables, and navigation rules are in `docs/SCREEN_FLOW.md`.

---

## 10. Path Aliases

Configured in `tsconfig.json` and `babel.config.js`:

| Alias               | Maps to                |
| ------------------- | ---------------------- |
| `@core/*`           | `src/core/*`           |
| `@application/*`    | `src/application/*`    |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@ui/*`             | `src/ui/*`             |
| `@navigation/*`     | `src/navigation/*`     |
| `@config/*`         | `src/config/*`         |

---

## 11. Key Constraints

- No `any` types.
- No raw string/number literals for grouped values — always use enums from `core/enums/`.
- No relative imports — always use path aliases.
- No business logic in components or stores.
- No concrete infrastructure class imported outside `registerServices.ts`.
- No test files (excluded from scope).
