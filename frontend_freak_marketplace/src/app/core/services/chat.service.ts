import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { 
  ChatRoom, 
  Message, 
  CreateChatRoomRequest, 
  SendMessageRequest 
} from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private apiService: ApiService) {}

  getChatRooms(): Observable<ChatRoom[]> {
    return this.apiService.get<ChatRoom[]>('/chat/rooms/');
  }

  getChatRoom(id: string): Observable<ChatRoom> {
    return this.apiService.get<ChatRoom>(`/chat/rooms/${id}/`);
  }

  getChatRoomMessages(roomId: string): Observable<Message[]> {
    return this.apiService.get<Message[]>(`/chat/rooms/${roomId}/messages/`);
  }

  createChatRoom(data: CreateChatRoomRequest): Observable<ChatRoom> {
    return this.apiService.post<ChatRoom>('/chat/rooms/create/', data);
  }

  sendMessage(data: SendMessageRequest): Observable<Message> {
    return this.apiService.post<Message>(`/chat/rooms/${data.room_id}/messages/`, {
      content: data.content
    });
  }

  markMessagesAsRead(roomId: string): Observable<void> {
    return this.apiService.post<void>(`/chat/rooms/${roomId}/mark-read/`, {});
  }

  getChatRoomForProduct(productId: number): Observable<ChatRoom> {
    return this.apiService.get<ChatRoom>(`/chat/product/${productId}/room/`);
  }

  // Additional helper methods
  getUnreadCount(): Observable<number> {
    return this.getChatRooms().pipe(
      map((rooms: ChatRoom[]) => 
        rooms.reduce((total: number, room: ChatRoom) => total + (room.unread_count || 0), 0)
      )
    );
  }
}
