import json
import uuid
from cryptography.fernet import Fernet
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message
from products.models import Product


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        
        # Autenticar usuario
        if not self.scope["user"].is_authenticated:
            await self.close()
            return
        
        # Verificar si el usuario tiene acceso a esta sala
        if not await self.has_room_access():
            await self.close()
            return
        
        # Unirse al grupo de la sala
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Salir del grupo de la sala
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type', 'message')
        
        if message_type == 'message':
            message_content = text_data_json['message']
            
            # Guardar mensaje en la base de datos
            message = await self.save_message(message_content)
            
            # Encriptar mensaje para enviar
            encrypted_content = await self.encrypt_message(message_content)
            
            # Enviar mensaje al grupo
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message_id': str(message.id),
                    'encrypted_content': encrypted_content,
                    'sender_id': self.scope["user"].id,
                    'sender_username': self.scope["user"].username,
                    'timestamp': message.timestamp.isoformat(),
                }
            )
        elif message_type == 'mark_read':
            # Marcar mensajes como leídos
            await self.mark_messages_as_read()
    
    async def chat_message(self, event):
        # Desencriptar mensaje para el cliente
        decrypted_content = await self.decrypt_message(event['encrypted_content'])
        
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message_id': event['message_id'],
            'message': decrypted_content,
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'timestamp': event['timestamp'],
            'is_me': event['sender_id'] == self.scope["user"].id,
        }))
    
    @database_sync_to_async
    def has_room_access(self):
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            user = self.scope["user"]
            return room.buyer == user or room.seller == user
        except ChatRoom.DoesNotExist:
            return False
    
    @database_sync_to_async
    def save_message(self, content):
        room = ChatRoom.objects.get(id=self.room_id)
        message = Message.objects.create(
            room=room,
            sender=self.scope["user"],
            content=content
        )
        
        # Actualizar last_message_at de la sala
        room.last_message_at = message.timestamp
        room.save()
        
        return message
    
    @database_sync_to_async
    def mark_messages_as_read(self):
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            user = self.scope["user"]
            # Marcar como leídos todos los mensajes que no son del usuario actual
            Message.objects.filter(
                room=room,
                is_read=False
            ).exclude(sender=user).update(is_read=True)
        except ChatRoom.DoesNotExist:
            pass
    
    @database_sync_to_async
    def get_room_cipher(self):
        """Obtener el cipher Fernet para la sala"""
        room = ChatRoom.objects.get(id=self.room_id)
        return room.get_cipher()
    
    async def encrypt_message(self, content):
        """Encriptar mensaje"""
        cipher = await self.get_room_cipher()
        encrypted_content = cipher.encrypt(content.encode()).decode()
        return encrypted_content
    
    async def decrypt_message(self, encrypted_content):
        """Desencriptar mensaje"""
        cipher = await self.get_room_cipher()
        decrypted_content = cipher.decrypt(encrypted_content.encode()).decode()
        return decrypted_content
