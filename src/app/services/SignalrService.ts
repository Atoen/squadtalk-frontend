import { Inject, Injectable, PLATFORM_ID, signal, untracked } from "@angular/core";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { isPlatformBrowser } from "@angular/common";
import { UserStatus } from "../data/enums/UserStatus";
import { HubHandler } from "../signalr/HubHandler";
import { HubResult, ValueHubResult } from "../signalr/HubResult";
import { UserDtoPacked } from "../data/dtos/UserDto";
import { PendingFriendRequestDtoPacked } from "../data/dtos/PendingFriendRequestDto";
import { GroupDtoPacked } from "../data/dtos/GroupDto";
import { UserAuthenticationService } from "./UserAuthenticationService";

@Injectable({providedIn: "root"})
export class SignalrService {

    private readonly _connection!: HubConnection;
    private readonly _connectPromise?: Promise<void>;
    private readonly _isBrowser: boolean;

    private readonly _userStatus = signal(UserStatus.Unknown);
    private readonly _connectionStatus = signal(HubConnectionState.Connecting);

    readonly userStatus = this._userStatus.asReadonly();
    readonly connectionStatus = this._connectionStatus.asReadonly();

    readonly handler!: HubHandler;

    constructor(
        private authService: UserAuthenticationService,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this._isBrowser = isPlatformBrowser(platformId);

        if (!this._isBrowser || !untracked(this.authService.isLoggedIn)) {
            return;
        }

        this._connection = new HubConnectionBuilder()
            .withUrl("/chathub")
            .withHubProtocol(new MessagePackHubProtocol())
            .withAutomaticReconnect()
            .withStatefulReconnect()
            .build();

        this.registerBaseHandlers();
        this.handler = new HubHandler(this._connection);

        this._connectPromise = this._connection.start()
            .then(() => {
                this._connectionStatus.set(HubConnectionState.Connected);
                this.updateSelfStatus();
            }).catch(err => console.error('Error while starting connection: ' + err));
    }

    setSelfStatus(status: UserStatus) {
        return this.send('ChangeStatus', status);
    }

    async getFriends() {
        return await this.invoke<UserDtoPacked[]>('GetFriendList');
    }

    async getGroups() {
        return this.invoke<GroupDtoPacked[]>('GetGroups');
    }

    async getFriendRequests() {
        return await this.invoke<PendingFriendRequestDtoPacked[]>('GetFriendRequests');
    }

    private updateSelfStatus() {
        this.invoke<UserStatus>('GetSelfStatus').then(x => {
            if (x.isSuccess) {
                this._userStatus.set(x.value);
            }
        })
    }

    private registerBaseHandlers() {
        this._connection.onreconnecting(_ => this._connectionStatus.set(HubConnectionState.Reconnecting));
        this._connection.onclose(_ => this._connectionStatus.set(HubConnectionState.Disconnected));
        this._connection.onreconnected(_ => {
            this._connectionStatus.set(HubConnectionState.Connected);
            this.updateSelfStatus();
        });

        this._connection.on('SelfStatusChanged', status => {
            console.log("User status changed")
            this._userStatus.set(status);
        });
    }

    private async invoke<T>(methodName: string, ...args: any[]): Promise<ValueHubResult<T>> {
        if (!this._isBrowser) {
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

    private async send(methodName: string, ...args: any[]): Promise<HubResult> {
        if (!this._isBrowser) {
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
