import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ChatGroup } from "@data/models";
import { FormsModule } from "@angular/forms";
import { InputText } from "primeng/inputtext";
import { FloatLabel } from "primeng/floatlabel";
import { Button } from "primeng/button";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-change-group-name',
    imports: [
        FormsModule,
        InputText,
        FloatLabel,
        Button,
        TranslatePipe
    ],
    templateUrl: './change-group-name.component.html',
    styleUrl: './change-group-name.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeGroupNameComponent implements OnInit {

    readonly dialogRef = inject(DynamicDialogRef);
    readonly dialogService = inject(DialogService);

    private group!: ChatGroup;
    name!: string;

    working = signal(false);

    ngOnInit() {
        const dialogInstance = this.dialogService.getInstance(this.dialogRef);
        if (!dialogInstance || !dialogInstance.data) {
            this.dialogRef.close();
        }

        this.group = dialogInstance.data['group'];
        this.name = this.group.customName() ?? '';
    }

    async changeGroupName() {

        this.working.set(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        this.working.set(false);
    }

    cancel() {
        this.dialogRef.close();
    }
}
