import {signal} from '@angular/core';
import {ChatMessage} from './ChatMessage';
import {ChatGroup} from './ChatGroup';
import { TextChatCursor } from "@dtos/TextChatCursor";
import { TextChatService } from "@services/TextChatService";

export class GroupState {
    readonly messages = signal<ChatMessage[]>([]);
    readonly scrolledToTop = signal(false);

    cursor: TextChatCursor = TextChatCursor.default;

    constructor(private readonly group: ChatGroup) {}

    insertPage(page: ChatMessage[]) {
        const isPartialPage = page.length < TextChatService.PageSize
        this.scrolledToTop.set(isPartialPage);

        if (page.length <= 0) {
            return;
        }

        this.messages.set([...page, ...this.messages()]);
        this.cursor = new TextChatCursor(page[0].id);
    }
}
