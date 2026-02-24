import { CryEvent } from "@core/entities/CryEvent";

export interface IEventLogRepository {
  logCryEvent(cryEvent: CryEvent): Promise<void>;
  getCryEventsForToday(userId: string): Promise<CryEvent[]>;
}
