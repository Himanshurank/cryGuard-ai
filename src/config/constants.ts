export const HEARTBEAT_INTERVAL_MS = 10_000;
export const MISSED_HEARTBEAT_LIMIT = 2;
export const CRY_CONFIDENCE_THRESHOLD = 0.7;
export const AUDIO_VOLUME_GATE_THRESHOLD = 0.02;
export const TCP_PORT = 9001;
export const MDNS_SERVICE_NAME = "cryguard-baby-station";

// Set to true while Supabase is under maintenance — bypasses all auth API calls.
// Flip back to false when Supabase is available again.
export const USE_MOCK_AUTH = true;
