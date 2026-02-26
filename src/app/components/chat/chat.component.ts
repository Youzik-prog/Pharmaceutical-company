import { Component, effect, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatService } from 'src/app/services/chat.service';
import { ChatMessage } from 'src/app/types/types';

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

  contextMenu = signal<{x: number, y: number, message: ChatMessage} | null>(null);
  editedMessage = signal<ChatMessage | null>(null);

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

  @HostListener('document:click')
  closeContextMenu() {
    this.contextMenu.set(null);
  }

  onRightClick(event: MouseEvent, message: ChatMessage) {
    event.preventDefault();
    this.contextMenu.set({
      x: event.clientX,
      y: event.clientY,
      message
    });
  }

  sendMessage() {
    const message = this.input().nativeElement.value;
    if(message) {
      this.chatService.sendMessage(message);
      this.input().nativeElement.value = '';
    }
  }

  editMessage(message: ChatMessage) {
    const input = this.input().nativeElement;
    input.value = message.text;
    input.focus();

    this.editedMessage.set(message);
  }

  updateMessage() {
    const newMessageText = this.input().nativeElement.value;
    const message = this.editedMessage();

    if(newMessageText && message) {
      message.text = newMessageText;
      this.chatService.updateMessage(message)
      this.input().nativeElement.value = '';
    }

    this.editedMessage.set(null);
  }

  deleteMessage(message: ChatMessage) {
    this.chatService.deleteMessage(message);
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
