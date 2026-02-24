export interface IAudioCaptureService {
  startCapture(): Promise<void>;
  stopCapture(): Promise<void>;
  onAudioFrame(callback: (pcmBuffer: Float32Array) => void): void;
}
