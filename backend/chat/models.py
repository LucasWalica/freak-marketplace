import uuid
from cryptography.fernet import Fernet
from django.db import models
from django.contrib.auth.models import User
from products.models import Product  # Asegúrate de importar tu modelo de Producto

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
    
    # Clave de cifrado para la sala (se genera automáticamente)
    encryption_key = models.BinaryField(
        editable=False, 
        null=False, 
        blank=False,
        default=Fernet.generate_key
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Evita que haya más de una sala para el mismo producto entre los mismos dos usuarios
        unique_together = ('product', 'buyer', 'seller')
        ordering = ['-last_message_at']

    def __str__(self):
        return f"Chat: {self.product.title} - {self.buyer.username} vs {self.seller.username}"
    
    def save(self, *args, **kwargs):
        # Generar clave de cifrado si es una nueva sala
        if not self.encryption_key:
            self.encryption_key = Fernet.generate_key()
        super().save(*args, **kwargs)
    
    def get_cipher(self):
        """Obtener el objeto Fernet para esta sala"""
        return Fernet(self.encryption_key)

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
