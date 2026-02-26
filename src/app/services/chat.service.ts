import { Injectable, signal } from '@angular/core';
import { CHAT_LOCAL_STORAGE_KEY, WEBSOCKET_URL } from '../constants/mainContants';
import { ChatMessage, ConnectionStatuses } from '../types/types';
import { webSocket } from 'rxjs/webSocket';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  
  private readonly url = WEBSOCKET_URL;

  private readonly localStorageKey = CHAT_LOCAL_STORAGE_KEY;

  private socket$ = webSocket<string>({
    url: this.url,
    deserializer: (message => message.data)
  });

  readonly messages$ = new BehaviorSubject<ChatMessage[]>(this.loadMessagesFromStorage());

  readonly status$ = new BehaviorSubject<ConnectionStatuses>('successful');

  constructor() {
    this.socket$.pipe(
      map((message: string) => message.replace(/^"|"$/g, '').replace(/\\n/g, '\n')),
      tap((message: string) => {
        this.addChatMessage({
          id: crypto.randomUUID(),
          text: message, 
          isSelf: false, 
          time: new Date(),
          status: 'successful',
        });
      })
    ).subscribe({
      error: (err) => {
        console.error('WebSocket error:', err);
        this.status$.next('error');
      },
      complete: () => {
        console.log('WebSocket connection closed');
        this.status$.next('closed');
      }
    });

    this.messages$.pipe(
      tap((messages) => {
        localStorage.setItem(this.localStorageKey, JSON.stringify(messages));
      })
    ).subscribe();
  }

  private loadMessagesFromStorage(): ChatMessage[] {
    const messages = localStorage.getItem(this.localStorageKey);
    if(!messages) return [];

    try {
      return JSON.parse(messages);
    } catch(error) {
      console.error('LocalStorage parsing error', error);
      return [];
    }

  }
  
  sendMessage(message: string) {
    
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: message,
      isSelf: true,
      time: new Date(),
      status: 'pending',
    };

    try {
      this.socket$.next(message);

      newMessage.status = 'successful';
    } catch (error) {
      newMessage.status = 'error';
      console.error('Error sending message:', error);
    }

    this.addChatMessage(newMessage);
  }

  updateMessage(message: ChatMessage) {
    this.messages$.next(this.messages$.value.map(msg => msg.id === message.id ? message : msg));
  }

  deleteMessage(message: ChatMessage) {
    this.messages$.next(this.messages$.value.filter(msg => msg.id !== message.id));
  }


  private addChatMessage(message: ChatMessage) {
    this.messages$.next([...this.messages$.value, message]);
  }

}
