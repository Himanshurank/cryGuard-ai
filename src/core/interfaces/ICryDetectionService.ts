export interface ICryDetectionService {
  loadModel(): Promise<void>;
  classifyAudioFrame(pcmBuffer: Float32Array): Promise<Record<string, number>>;
  isCrying(pcmBuffer: Float32Array): Promise<boolean>;
}
