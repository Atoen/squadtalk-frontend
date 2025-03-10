import {signal} from '@angular/core';
import {ChatMessage} from './ChatMessage';
import {ChatGroup} from './ChatGroup';

export class GroupState {
    messages = signal<ChatMessage[]>([]);

    constructor(private readonly group: ChatGroup) {}
}
