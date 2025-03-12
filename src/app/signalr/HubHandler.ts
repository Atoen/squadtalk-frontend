import { Observable } from "rxjs";
import { MessageDto } from "../data/dtos/MessageDto";
import { GroupId } from "../data/ids/GroupId";
import { HubConnection } from "@microsoft/signalr";

export class HubHandler {

    readonly messageReceived$: Observable<MessageDto>;
    readonly groupNameChanged$: Observable<{ groupId: GroupId; name?: string }>;

    constructor(connection: HubConnection) {
        this.messageReceived$ = new Observable((observer) => {
            connection.on('ReceivedMessage', packed => {
                observer.next(MessageDto.unpack(packed));
            });
        });

        this.groupNameChanged$ = new Observable((observer) => {
            connection.on('GroupNameChanged', (groupId, name) => {
                observer.next({ groupId: groupId[0], name });
            })
        });
    }
}