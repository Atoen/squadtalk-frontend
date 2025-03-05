import { ErrorHandler, inject, Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({providedIn: "root"})
export class ToastErrorHandler implements ErrorHandler {

    private messageService = inject(MessageService);

    handleError(error: any): void {

        console.log("handling error", error)

        this.messageService.add({
            severity: 'error',
            summary: 'Unexpected error',
            detail: error.toString(),
            life: 3000
        });
    }
}