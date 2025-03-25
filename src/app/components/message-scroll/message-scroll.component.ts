import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, ViewChild } from '@angular/core';
import { ChatGroup } from "@data/models";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { ChatMessageComponent } from "@components/chat-message/chat-message.component";
import { TextChatService } from "@services/TextChatService";

@Component({
    selector: 'app-message-scroll',
    imports: [
        InfiniteScrollDirective,
        ChatMessageComponent
    ],
    templateUrl: './message-scroll.component.html',
    styleUrl: './message-scroll.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageScrollComponent implements OnInit {

    textChatService = inject(TextChatService);
    groupChat = input.required<ChatGroup>();
    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

    onScrollUp() {
        console.log("Scrolled up");

        this.textChatService.addMessagePage(this.groupChat());
    }

    ngOnInit() {
        this.textChatService.addMessagePage(this.groupChat())
            ?.then(() => {

                setTimeout(() => this.scrollToBottom(), 500);
            });
    }

    private scrollToBottom() {

        console.log('scrolling');

        if (this.scrollContainer) {

            console.log('is', this.groupChat().messages());

            const native = this.scrollContainer.nativeElement;
            native.scrollTop = native.scrollHeight;
        }
    }
}
