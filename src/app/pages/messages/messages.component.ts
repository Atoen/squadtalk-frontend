import { Component, inject } from '@angular/core';
import { ChatManager } from "@services/ChatManager";
import { GroupImageComponent } from "@components/group-image/group-image.component";

import { Button } from "primeng/button";
import { FormatLastMessageContentPipe } from "@data/pipes/FormatLastMessageContentPipe";
import { FormatTimestampPipe } from "@data/pipes/FormatTimestampPipe";
import { TimestampFormatMode } from "@data/enums/TimestampFormatMode";


@Component({
    selector: 'app-messages',
    imports: [
    GroupImageComponent,
    Button,
    FormatLastMessageContentPipe,
    FormatLastMessageContentPipe,
    FormatTimestampPipe
],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css'
})
export class MessagesComponent {
    chatManager = inject(ChatManager);
    protected readonly TimestampFormatMode = TimestampFormatMode;
}
