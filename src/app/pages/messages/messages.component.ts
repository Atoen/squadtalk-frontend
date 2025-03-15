import { Component, inject } from '@angular/core';
import { ChatManager } from "../../services";
import { GroupImageComponent } from "../../components/group-image/group-image.component";
import { DatePipe } from "@angular/common";
import { Button } from "primeng/button";

@Component({
    selector: 'app-messages',
    imports: [
        GroupImageComponent,
        DatePipe,
        Button
    ],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css'
})
export class MessagesComponent {
    chatManager = inject(ChatManager);
}
