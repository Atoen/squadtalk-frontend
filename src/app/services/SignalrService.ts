import { Inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { isPlatformServer } from "@angular/common";
import { MessageDtoPacked } from "../data/dtos/MessageDto";
import { UserStatus } from "../data/enums/UserStatus";

@Injectable({providedIn: "root"})
export class SignalrService {

    private connection!: HubConnection;

    private _userStatus = signal(UserStatus.Unknown);

    userStatus = this._userStatus.asReadonly();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformServer(this.platformId)) return;

        this.connection = new HubConnectionBuilder()
            .withUrl("/chathub")
            .withHubProtocol(new MessagePackHubProtocol())
            .withAutomaticReconnect()
            .withStatefulReconnect()
            .build();
    }

    private setEventHandlers() {
        this.connection.on('ReceivedMessage', (data: MessageDtoPacked) => {
            console.log('raw data:', data);
            console.log('unpacked:', );
        });

        this.connection.on('SelfStatusChanged', (status: UserStatus) => {
            this._userStatus.set(status);
        });
    }

    connect() {

        this.setEventHandlers();

        this.connection.start()
            .then(async () => {
                const status = await this.connection.invoke<UserStatus>('GetSelfStatus');
                this._userStatus.set(status);
            })
            .catch(err => console.error('Error while starting connection: ' + err));
    }

    async setSelfStatus(status: UserStatus) {
        return this.connection.send('ChangeStatus', status);
    }
}