import { Component, input } from '@angular/core';
import { ChatGroup } from "@data/models";

@Component({
    selector: 'app-group-image',
    imports: [],
    templateUrl: './group-image.component.html',
    styleUrl: './group-image.component.css'
})
export class GroupImageComponent {
    group = input.required<ChatGroup>();
}
