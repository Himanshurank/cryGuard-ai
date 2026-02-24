export interface INotificationService {
  triggerAlarm(): Promise<void>;
  stopAlarm(): Promise<void>;
  triggerConnectionLostAlert(): Promise<void>;
}
