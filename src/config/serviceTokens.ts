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
