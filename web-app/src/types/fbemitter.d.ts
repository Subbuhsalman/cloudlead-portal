declare module 'fbemitter' {
  export class EventEmitter {
    addListener(eventType: string, listener: Function): any;
    emit(eventType: string, ...args: any[]): void;
    removeListener(subscription: any): void;
    removeAllListeners(eventType?: string): void;
  }
}
