import { DatePipe } from '@angular/common';
import { Component, effect, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';
import { ChatMessage } from 'src/app/types/types';

type ContextMenu = {
  x: number
  y: number, 
  message: ChatMessage
}

@Component({
  selector: 'app-chat',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent  {

  private chatService = inject(ChatService);

  messages = toSignal(this.chatService.messages$);
  status = toSignal(this.chatService.status$);

  contextMenu = signal<ContextMenu | null>(null);
  editedMessage = signal<ChatMessage | null>(null);

  input = new FormControl('');
  inputElement = viewChild<ElementRef<HTMLTextAreaElement>>('messageInput');
  chatContainer = viewChild<ElementRef<HTMLDivElement>>('chatContainer');
  
  constructor() {
    effect(() => {
      this.messages();
      this.status();

      // Made it async to wait for the HTML chat element to update
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

  sendMessage($event: Event) {
    $event.preventDefault();

    const message = this.input.value;
    if(message) {
      this.chatService.sendMessage(message);
      this.input.setValue('');
    }
  }

  editMessage(message: ChatMessage) {

    this.input.setValue(message.text);
    this.inputElement()?.nativeElement.focus();

    this.editedMessage.set(message);
  }

  updateMessage($event: Event) {
    $event.preventDefault();

    const newMessageText = this.input.value;
    const message = this.editedMessage();

    if(newMessageText && message) {
      message.text = newMessageText;
      this.chatService.updateMessage(message)
      this.input.setValue('');
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
