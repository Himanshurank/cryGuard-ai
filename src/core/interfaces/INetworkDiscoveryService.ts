export interface INetworkDiscoveryService {
  advertise(serviceName: string, port: number): void;
  discover(serviceName: string): Promise<string>;
  stopAdvertising(): void;
  stopDiscovery(): void;
}
