import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { WebSocketMessage, Message } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any> | null = null;
  private messageSubject = new Subject<Message>();
  private connectionStatusSubject = new Subject<boolean>();

  public messages$ = this.messageSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() { }

  connect(roomId: string): void {
    if (this.socket$) {
      this.disconnect();
    }

    const token = localStorage.getItem('access_token');
    const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`;

    this.socket$ = webSocket(wsUrl);

    this.socket$.subscribe({
      next: (message) => {
        this.handleMessage(message);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
        this.connectionStatusSubject.next(false);
      },
      complete: () => {
        console.log('WebSocket connection closed');
        this.connectionStatusSubject.next(false);
      }
    });

    this.connectionStatusSubject.next(true);
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
      this.connectionStatusSubject.next(false);
    }
  }

  sendMessage(message: WebSocketMessage): void {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }

  sendChatMessage(roomId: string, content: string): void {
    this.sendMessage({
      type: 'message',
      payload: {
        room_id: roomId,
        content: content
      }
    });
  }

  sendTypingIndicator(roomId: string, isTyping: boolean): void {
    this.sendMessage({
      type: 'typing',
      payload: {
        room_id: roomId,
        is_typing: isTyping
      }
    });
  }

  markAsRead(roomId: string, messageIds: string[]): void {
    this.sendMessage({
      type: 'read_receipt',
      payload: {
        room_id: roomId,
        message_ids: messageIds
      }
    });
  }

  private handleMessage(message: any): void {
    try {
      const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
      
      switch (parsedMessage.type) {
        case 'message':
          this.messageSubject.next(parsedMessage.payload);
          break;
        case 'typing':
          // Handle typing indicators
          break;
        case 'read_receipt':
          // Handle read receipts
          break;
        default:
          console.log('Unknown message type:', parsedMessage.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  isConnected(): boolean {
    return this.socket$ !== null;
  }
}
