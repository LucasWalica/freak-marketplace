export interface ChatRoom {
  id: string;
  product: {
    id: string;
    title: string;
    images: string[];
  };
  buyer: {
    id: number;
    username: string;
  };
  seller: {
    id: number;
    username: string;
  };
  created_at: string;
  last_message_at: string;
  unread_count?: number;
  last_message?: string;
}

export interface Message {
  id: string;
  room: string;
  sender: {
    id: number;
    username: string;
  };
  content: string;
  timestamp: string;
  is_read: boolean;
}

export interface CreateChatRoomRequest {
  product_id: number;
}

export interface SendMessageRequest {
  content: string;
  room_id: string;
}

export interface ChatMessage {
  type: 'message' | 'typing' | 'read_receipt';
  data: Message | {
    room_id: string;
    user_id: number;
    is_typing: boolean;
  } | {
    room_id: string;
    message_ids: string[];
  };
}

export interface WebSocketMessage {
  type: string;
  payload: any;
}
