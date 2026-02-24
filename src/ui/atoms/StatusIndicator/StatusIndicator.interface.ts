export type PermissionIndicatorStatus = "GRANTED" | "DENIED" | "PENDING";

export interface StatusIndicatorProps {
  status: PermissionIndicatorStatus;
  size?: number;
}
