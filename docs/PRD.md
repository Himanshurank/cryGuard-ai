This is the comprehensive **Product Requirements Document (PRD)** for **CryGuard**, a high-reliability, AI-powered, offline-first baby monitor built with React Native and Supabase.

---

# 📄 Product Requirements Document: CryGuard

**Version:** 1.0

**Status:** Ready for Development

**Core Objective:** To provide a zero-latency, battery-efficient baby monitoring system that works without internet, using AI to distinguish between "noise" and "crying."

---

## 1. User Roles & Experience

The app features a dual-mode startup. A user logs in via Supabase (for history/identity) and selects a role:

- **Baby Station (Transmitter):** Placed in the baby’s room. Acts as a Local TCP Server.
- **Parent Station (Receiver):** Carried by the parent. Acts as a Local TCP Client.

---

## 2. Technical Architecture

The system follows a **Local-First** approach.

| Component                     | Technology                              | Logic                                                       |
| ----------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| **Cross-Platform Framework**  | React Native                            | Shared codebase for iOS and Android.                        |
| **Sound Classification (AI)** | TensorFlow Lite (YAMNet)                | Local inference; no audio data leaves the device.           |
| **Local Communication**       | TCP Sockets (`react-native-tcp-socket`) | Direct IP-to-IP messaging via Wi-Fi router.                 |
| **Device Discovery**          | Zeroconf / mDNS                         | Parent phone finds Baby phone automatically on the network. |
| **Cloud Database**            | **Supabase**                            | Authenticates users and stores a history of "Cry Events."   |
| **Background Persistence**    | Foreground Service (Android)            | Ensures the Mic and AI keep running when the screen is off. |

---

## 3. Functional Requirements

### 3.1 AI-Powered Cry Detection

- **Audio Sampling:** Capture mono audio at 16kHz.
- **The "Gatekeeper" (Battery Saver):** The AI model only runs if the ambient volume exceeds a threshold (e.g., ).
- **Classification:** Use the TFLite model to identify the "Baby Crying" class with a confidence score .

### 3.2 Offline Messaging (The "Ring")

- **Zero Latency:** When a cry is confirmed, the Baby Station sends a TCP packet to the Parent Station.
- **The Alarm:** The Parent Station plays a custom, high-priority "Siren" sound.
- **Volume Override:** The alarm must play even if the Parent Station is on "Silent" or "Do Not Disturb" (requires specific native permissions).

### 3.3 Connectivity & Safety (Heartbeat)

- **The Pulse:** The Baby Station sends a "Heartbeat" every 10 seconds.
- **Fail-Safe:** If the Parent Station misses 2 consecutive heartbeats, it triggers a **"Connection Lost"** alert to warn the parent that the monitor is down.

### 3.4 Supabase Integration (Cloud Sync)

- **Auth:** Users log in so that only "Parent A" can connect to "Baby A."
- **Event Logging:** Every "Cry" event is logged to a Supabase table with a timestamp for morning review.

---

## 4. Hardware & Permissions Requirements

To ensure the app works in the background and stays alive:

- **Microphone:** Permanent access.
- **Local Network:** Permission to scan for devices on the Wi-Fi.
- **Battery Optimization:** User must "Exclude" the app from battery optimization (Android).
- **Notifications:** High-priority / Critical alert permissions.

---

## 5. Non-Functional Requirements (The "Demands")

| Demand                | Implementation Strategy                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| **Very Less Battery** | Use **Gated AI Activation** (Mic volume triggers AI) and **UDP/TCP** instead of constant HTTP polling. |
| **Offline Work**      | AI model is bundled in the APK/IPA. Local TCP Sockets bypass the ISP.                                  |
| **Parent Speaker**    | Stay **Silent** 99% of the time. Only "Open" (Ring) when a cry is detected.                            |

---

## 6. Success Metrics

1. **Latency:** from Cry Detection to Parent Ringing.
2. **Accuracy:** False Positive rate (e.g., ignoring a falling book).
3. **Uptime:** 10+ hours of monitoring on a single charge.

---
