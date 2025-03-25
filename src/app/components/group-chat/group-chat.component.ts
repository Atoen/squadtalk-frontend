import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ChatGroup } from "@data/models";
import { GroupImageComponent } from "@components/group-image/group-image.component";
import { FormatLastMessageContentPipe } from "@data/pipes/FormatLastMessageContentPipe";
import { FormatTimestampPipe } from "@data/pipes/FormatTimestampPipe";
import { TimestampFormatMode } from "@data/enums/TimestampFormatMode";
import { Badge } from "primeng/badge";

@Component({
    selector: 'app-group-chat',
    imports: [
        GroupImageComponent,
        FormatLastMessageContentPipe,
        FormatTimestampPipe,
        Badge
    ],
    templateUrl: './group-chat.component.html',
    styleUrl: './group-chat.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupChatComponent {
    chatGroup = input.required<ChatGroup>();
    protected readonly TimestampFormatMode = TimestampFormatMode;
}
