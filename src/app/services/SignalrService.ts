import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { isPlatformServer } from "@angular/common";
import { MessageDto, MessageDtoPacked } from "../data/dtos/MessageDto";
import { PendingFriendRequestDto, PendingFriendRequestDtoPacked } from "../data/dtos/PendingFriendRequestDto";

@Injectable({providedIn: "root"})
export class SignalrService {

    private connection!: HubConnection;

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
            console.log('unpacked:', MessageDto.unpack(data));
        });
    }

    connect() {

        this.setEventHandlers();

        this.connection.start()
            .then(() => {
                this.connection.invoke<PendingFriendRequestDtoPacked[]>('GetFriendRequests').then(x => {
                    console.log('friend requests raw:', x);

                    const unpacked = x.map(y => PendingFriendRequestDto.unpack(y));
                    console.log('friend request unpacked', unpacked);
                });
            })
            .catch(err => console.error('Error while starting connection: ' + err));
    }
}