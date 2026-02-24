import { TcpMessage } from "@core/entities/TcpMessage";

export interface ITcpSocketService {
  startServer(port: number): Promise<void>;
  connectToServer(ipAddress: string, port: number): Promise<void>;
  sendMessage(message: TcpMessage): void;
  onMessage(callback: (message: TcpMessage) => void): void;
  disconnect(): void;
}
