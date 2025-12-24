import uuid
from django.db import models
from django.contrib.auth.models import User
from .models import Product  # Asegúrate de importar tu modelo de Producto

class ChatRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # El producto por el que se está negociando
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='chat_rooms'
    )
    
    # Participantes: Comprador y Vendedor
    buyer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='chats_as_buyer'
    )
    seller = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='chats_as_seller'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Evita que haya más de una sala para el mismo producto entre los mismos dos usuarios
        unique_together = ('product', 'buyer', 'seller')
        ordering = ['-last_message_at']

    def __str__(self):
        return f"Chat: {self.product.title} - {self.buyer.username} vs {self.seller.username}"

class Message(models.Model):
    room = models.ForeignKey(
        ChatRoom, 
        on_delete=models.CASCADE, 
        related_name='messages'
    )
    sender = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='sent_messages'
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"De {self.sender.username} en {self.room.id}"