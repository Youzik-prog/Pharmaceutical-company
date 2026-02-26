import { Injectable, signal } from '@angular/core';
import { WEBSOCKET_URL } from '../constants/mainContants';
import { ChatMessage, ConnectionStatuses } from '../types/types';
import { webSocket } from 'rxjs/webSocket';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  
  private readonly url = WEBSOCKET_URL;

  private socket$ = webSocket<any>({
    url: this.url,
    deserializer: (message => message.data)
  });

  readonly messages$ = new BehaviorSubject<ChatMessage[]>([]);

  constructor() {
    this.socket$.pipe(
      tap((message: string) => {
        this.addChatMessage({
          id: crypto.randomUUID(),
          text: message, 
          isSelf: false, 
          time: new Date(),
          status: 'successful',
        });
        console.log(this.messages$.value);
      })
    ).subscribe({
      error: (err) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed')
    });
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

  private addChatMessage(message: ChatMessage) {
    this.messages$.next([...this.messages$.value, message]);
  }

}
