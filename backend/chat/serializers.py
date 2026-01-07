from rest_framework import serializers
from .models import ChatRoom, Message
from products.serializers import ProductSerializer
from users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'content', 'timestamp', 'is_read', 'sender_username', 'sender_id']
        read_only_fields = ['timestamp', 'is_read']


class ChatRoomSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    buyer = UserSerializer(read_only=True)
    seller = UserSerializer(read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = ['id', 'product', 'buyer', 'seller', 'created_at', 'last_message_at', 
                  'last_message', 'unread_count']
        read_only_fields = ['created_at', 'last_message_at']
    
    def get_last_message(self, obj):
        last_message = obj.messages.first()
        if last_message:
            return MessageSerializer(last_message).data
        return None
    
    def get_unread_count(self, obj):
        # Contar mensajes no leídos que no son del usuario actual
        request = self.context.get('request')
        if request and request.user:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0


class CreateChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['product', 'buyer', 'seller']
    
    def validate(self, data):
        # Verificar que el comprador y vendedor sean diferentes
        if data['buyer'] == data['seller']:
            raise serializers.ValidationError("El comprador y el vendedor deben ser diferentes")
        
        # Verificar que la sala no exista ya
        existing_room = ChatRoom.objects.filter(
            product=data['product'],
            buyer=data['buyer'],
            seller=data['seller']
        ).first()
        
        if existing_room:
            raise serializers.ValidationError("Ya existe una sala de chat para este producto entre estos usuarios")
        
        return data
