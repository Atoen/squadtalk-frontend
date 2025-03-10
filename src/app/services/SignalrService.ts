import { Inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { isPlatformServer } from "@angular/common";
import {MessageDto, MessageDtoPacked} from "../data/dtos/MessageDto";
import { UserStatus } from "../data/enums/UserStatus";
import {GroupDto, GroupDtoPacked} from '../data/dtos/GroupDto';
import {AsyncSubject, map, Observable, Subject} from 'rxjs';
import { GroupId } from "../data/ids/GroupId";
import {UserId} from '../data/ids/UserId';

@Injectable({providedIn: "root"})
export class SignalrService {

    private readonly connection!: HubConnection;

    private _userStatus = signal(UserStatus.Unknown);
    userStatus = this._userStatus.asReadonly();

    messageReceived$!: Observable<MessageDto>;
    // userIsTyping$!: Observable<{ groupId: GroupId; userId: UserId }>;
    // userStoppedTyping$!: Observable<{ groupId: GroupId; userId: UserId }>;
    groupNameChanged$!: Observable<{ groupId: GroupId; name?: string }>;
    // addedToGroup$!: Observable<GroupDto>;
    // groupDeleted$!: Observable<GroupId>;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformServer(this.platformId)) return;

        this.connection = new HubConnectionBuilder()
            .withUrl("/chathub")
            .withHubProtocol(new MessagePackHubProtocol())
            .withAutomaticReconnect()
            .withStatefulReconnect()
            .build();

        this.setEventHandlers();
    }

    private setEventHandlers() {
        this.connection.on('SelfStatusChanged', status => this._userStatus.set(status));

        this.messageReceived$ = new Observable((observer) => {
            this.connection.on('ReceivedMessage', packed => {
                observer.next(MessageDto.unpack(packed));
            });
        });

        this.groupNameChanged$ = new Observable((observer) => {
           this.connection.on('GroupNameChanged', (groupId, name) => {
               observer.next({ groupId: GroupId.unpack(groupId), name });
           })
        });
    }

    connect() {

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

    private async fetchData() {
        const status = await this.connection.invoke<UserStatus>('GetSelfStatus');
        this._userStatus.set(status);

        // this.connection.invoke<GroupDtoPacked[]>('GetGroups').then(x => {
        //     const unpacked = x.map(GroupDto.unpack);
        //     this.groupsSubject.next(unpacked);
        // });
    }

    async getGroups() {
        const packed = await this.connection.invoke<GroupDtoPacked[]>('GetGroups');
        return packed.map(x => GroupDto.unpack(x));
    }
}
