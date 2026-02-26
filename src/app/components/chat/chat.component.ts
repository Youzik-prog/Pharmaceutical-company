import { Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent  {

  private chatService = inject(ChatService);

  messages = toSignal(this.chatService.messages$);
  // status = this.chatService.status;

  input = viewChild.required<ElementRef<HTMLInputElement>>('messageInput');
  
  // ngOnInit(): void {
  //   this.chatService.connect();
  // }
  
  // ngOnDestroy(): void {
  //   this.chatService.disconnect();
  // }
  
  sendMessage() {
    const message = this.input().nativeElement.value;
    if(message) {
      this.chatService.sendMessage(message);
      this.input().nativeElement.value = '';
    }
    console.log(this.messages());
  }
  
  
}
