import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ChatListComponent {
  constructor(private router:Router) {}

  navigateToChatDetail(roomId: number): void {
    this.router.navigate([`/chat/${roomId}`]);
  }
}
