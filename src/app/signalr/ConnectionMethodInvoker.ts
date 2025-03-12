import { HubResult, ValueHubResult } from "./HubResult";

export interface ConnectionMethodInvoker {
    invoke<T>(methodName: string, ...args: any[]): Promise<ValueHubResult<T>>;
    send(methodName: string, ...args: any[]): Promise<HubResult>;
}