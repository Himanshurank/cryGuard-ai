import { EAppRole } from "@core/enums/AppRole";

export interface DeviceInfo {
  deviceId: string;
  ipAddress: string;
  deviceName: string;
  role: EAppRole;
}
