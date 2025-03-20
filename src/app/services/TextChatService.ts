import { Injectable, untracked } from "@angular/core";
import { SignalrService } from "@services/SignalrService";
import { HubMethodInvoker } from "@signalr/HubMethodInvoker";
import { MessageDto } from "@data/dtos";
import { ChatManager } from "@services/ChatManager";
import { ChatGroup, ChatMessage } from "@data/models";
import { ContactManager } from "@services/ContactManager";

@Injectable({providedIn: "root"})
export class TextChatService {

    private readonly _hubInvoker: HubMethodInvoker;

    static readonly PageSize = 20;

    constructor(
        private readonly chatManager: ChatManager,
        private readonly contactManager: ContactManager,
        signalrService: SignalrService
    ) {
        this._hubInvoker = signalrService.methodInvoker;

        if (!signalrService.connectionCreated) return;

        signalrService.eventHandler.messageReceived$.subscribe(x => this.messageReceived(x));
    }

    async sendMessage(message: string, group: ChatGroup) {
        const result = await this._hubInvoker.sendMessage(message, group.id);
    }

    addMessagePage(group: ChatGroup) {
        if (untracked(group.state.scrolledToTop)) {
            return;
        }

        return this.getMessagePage(group)
            .then(x => group.state.insertPage(x));
    }

    private async getMessagePage(group: ChatGroup): Promise<ChatMessage[]> {
        const result = await this._hubInvoker.getMessagePage(group.id, group.state.cursor);
        if (result.errorOrValueIs([])) {
            return [];
        }

        return result.value
            .map(MessageDto.unpack)
            .map(x => new ChatMessage(x, this.contactManager.userModelProvider));
    }

    private messageReceived(messageDto: MessageDto) {
        const group = this.chatManager.getGroup(messageDto.groupId);
        if (!group) return;

        const message = new ChatMessage(messageDto, this.contactManager.userModelProvider);
        group.addMessage(message);

        if (untracked(this.chatManager.currentGroup)?.id !== group.id && !message.isByLocalUser) {
            group.unreadMessages.update(x => x + 1);
        }
    }
}
