import { Inject, Injectable, PLATFORM_ID, signal, untracked } from "@angular/core";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { isPlatformServer } from "@angular/common";
import { HubEventHandler } from "../signalr/HubEventHandler";
import { HubResult, ValueHubResult } from "../signalr/HubResult";
import { UserAuthenticationService } from "./UserAuthenticationService";
import { HubMethodInvoker } from "../signalr/HubMethodInvoker";
import { ConnectionMethodInvoker } from "../signalr/ConnectionMethodInvoker";

@Injectable({providedIn: "root"})
export class SignalrService implements ConnectionMethodInvoker {

    private readonly _connection!: HubConnection;
    private readonly _connectPromise?: Promise<void>;

    private readonly _connectionStatus = signal(HubConnectionState.Connecting);
    readonly connectionStatus = this._connectionStatus.asReadonly();

    readonly connectionCreated: boolean;
    readonly methodInvoker!: HubMethodInvoker;
    readonly eventHandler!: HubEventHandler;

    constructor(
        private authService: UserAuthenticationService,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.methodInvoker = new HubMethodInvoker(this);

        if (isPlatformServer(platformId) || !untracked(this.authService.isLoggedIn)) {
            this.connectionCreated = false;
            return;
        }

        this._connection = new HubConnectionBuilder()
            .withUrl("/chathub")
            .withHubProtocol(new MessagePackHubProtocol())
            .withAutomaticReconnect()
            .withStatefulReconnect()
            .build();

        this.registerBaseHandlers();
        this.eventHandler = new HubEventHandler(this._connection);

        this.connectionCreated = true;

        this._connectPromise = this._connection.start()
            .then(() => this._connectionStatus.set(HubConnectionState.Connected))
            .catch(err => console.error('Error while starting connection: ' + err));
    }

    private registerBaseHandlers() {
        this._connection.onreconnecting(_ => this._connectionStatus.set(HubConnectionState.Reconnecting));
        this._connection.onclose(_ => this._connectionStatus.set(HubConnectionState.Disconnected));
        this._connection.onreconnected(_ => this._connectionStatus.set(HubConnectionState.Connected));
    }

    async invoke<T>(methodName: string, ...args: any[]): Promise<ValueHubResult<T>> {
        if (!this.connectionCreated) {
            return ValueHubResult.Error;
        }

        try {
            await this._connectPromise;
            const result = await this._connection.invoke<T>(methodName, ...args);
            return ValueHubResult.Ok<T>(result);
        } catch (e) {
            console.error(`Error while invoking hub method ${methodName}`, e);
            return ValueHubResult.Error;
        }
    }

    async send(methodName: string, ...args: any[]): Promise<HubResult> {
        if (!this.connectionCreated) {
            return HubResult.Error;
        }

        try {
            await this._connectPromise;
            await this._connection.send(methodName, ...args);
            return HubResult.Ok;
        } catch (e) {
            console.error(`Error while invoking hub method ${methodName}`, e);
            return HubResult.Error;
        }
    }
}
