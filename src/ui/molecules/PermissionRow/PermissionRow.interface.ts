import { PermissionIndicatorStatus } from "@ui/atoms/StatusIndicator/StatusIndicator.interface";

export interface PermissionRowProps {
  iconName: string;
  permissionName: string;
  reason: string;
  status: PermissionIndicatorStatus;
}
