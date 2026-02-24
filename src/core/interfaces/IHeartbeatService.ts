export interface IHeartbeatService {
  startBeating(onBeat: () => void): void;
  stopBeating(): void;
  onMissedBeat(callback: (missedCount: number) => void): void;
}
