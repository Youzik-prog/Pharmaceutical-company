import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
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
  status = toSignal(this.chatService.status$);

  input = viewChild.required<ElementRef<HTMLInputElement>>('messageInput');
  chatContainer = viewChild<ElementRef<HTMLDivElement>>('chatContainer');
  
  constructor() {
    effect(() => {
      this.messages();
      this.status();

      setTimeout(() => {
        this.scrollToBottom();
      }, 0)
    })
  }

  sendMessage() {
    const message = this.input().nativeElement.value;
    if(message) {
      this.chatService.sendMessage(message);
      this.input().nativeElement.value = '';
    }
    console.log(this.messages());
  }

  private scrollToBottom() {
    const el = this.chatContainer()?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  adjustTextAreaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
  
    textarea.style.height = 'auto';
    
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
