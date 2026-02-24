type ServiceFactory<ServiceType> = () => ServiceType;

class ServiceContainer {
  private readonly singletonRegistry = new Map<symbol, unknown>();
  private readonly factoryRegistry = new Map<symbol, ServiceFactory<unknown>>();

  registerSingleton<ServiceType>(
    token: symbol,
    serviceFactory: ServiceFactory<ServiceType>,
  ): void {
    this.factoryRegistry.set(token, serviceFactory as ServiceFactory<unknown>);
  }

  resolve<ServiceType>(token: symbol): ServiceType {
    if (this.singletonRegistry.has(token)) {
      return this.singletonRegistry.get(token) as ServiceType;
    }
    const serviceFactory = this.factoryRegistry.get(token);
    if (!serviceFactory) {
      throw new Error(
        `ServiceContainer: No registration found for token ${token.toString()}`,
      );
    }
    const serviceInstance = serviceFactory() as ServiceType;
    this.singletonRegistry.set(token, serviceInstance);
    return serviceInstance;
  }
}

export const applicationContainer = new ServiceContainer();
