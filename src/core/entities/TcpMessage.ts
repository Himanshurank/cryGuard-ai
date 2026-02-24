import { ETcpMessageType } from "@core/enums/TcpMessageType";

export interface TcpMessage {
  type: ETcpMessageType;
  payload?: unknown;
  timestamp: number;
}
