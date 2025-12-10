import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AppMessages {
  constructor(private messageService: MessageService) {}
   error(detail: string ){
      this.messageService.add({ 
        severity: 'error', 
        sticky:true,
        summary: 'Error', 
        detail: detail
      });
    }
   success(detail: string ){
      this.messageService.add({
        severity: 'success',
        detail
      });
    }
}
