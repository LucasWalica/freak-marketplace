from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer, CreateChatRoomSerializer
from products.models import Product


class ChatRoomListView(generics.ListAPIView):
    """Lista todas las salas de chat del usuario actual"""
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(
            Q(buyer=user) | Q(seller=user)
        ).distinct().order_by('-last_message_at')


class ChatRoomDetailView(generics.RetrieveAPIView):
    """Obtener detalles de una sala de chat específica"""
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(
            Q(buyer=user) | Q(seller=user)
        ).distinct()


class MessageListView(generics.ListAPIView):
    """Lista todos los mensajes de una sala de chat"""
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        room_id = self.kwargs['room_id']
        user = self.request.user
        
        # Verificar que el usuario tenga acceso a esta sala
        room = get_object_or_404(ChatRoom, id=room_id)
        if room.buyer != user and room.seller != user:
            return Message.objects.none()
        
        return Message.objects.filter(room=room).order_by('timestamp')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_chat_room(request):
    """Crear una nueva sala de chat para un producto"""
    product_id = request.data.get('product_id')
    buyer_id = request.data.get('buyer_id')
    seller_id = request.data.get('seller_id')
    
    if not all([product_id, buyer_id, seller_id]):
        return Response(
            {'error': 'Se requieren product_id, buyer_id y seller_id'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        product = Product.objects.get(id=product_id)
        buyer = User.objects.get(id=buyer_id)
        seller = User.objects.get(id=seller_id)
        
        # Verificar que el usuario actual sea el comprador o vendedor
        if request.user != buyer and request.user != seller:
            return Response(
                {'error': 'No tienes permiso para crear esta sala'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar si ya existe la sala
        existing_room = ChatRoom.objects.filter(
            product=product,
            buyer=buyer,
            seller=seller
        ).first()
        
        if existing_room:
            serializer = ChatRoomSerializer(existing_room, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Crear nueva sala
        room_data = {
            'product': product.id,
            'buyer': buyer.id,
            'seller': seller.id
        }
        serializer = CreateChatRoomSerializer(data=room_data)
        if serializer.is_valid():
            room = serializer.save()
            response_serializer = ChatRoomSerializer(room, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Product.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_messages_read(request, room_id):
    """Marcar todos los mensajes de una sala como leídos para el usuario actual"""
    room = get_object_or_404(ChatRoom, id=room_id)
    user = request.user
    
    # Verificar que el usuario tenga acceso a esta sala
    if room.buyer != user and room.seller != user:
        return Response(
            {'error': 'No tienes acceso a esta sala'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Marcar mensajes como leídos
    updated_count = Message.objects.filter(
        room=room,
        is_read=False
    ).exclude(sender=user).update(is_read=True)
    
    return Response({
        'message': f'Marcados {updated_count} mensajes como leídos',
        'unread_count': 0
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_room_for_product(request, product_id):
    """Obtener la sala de chat para un producto específico con el usuario actual"""
    try:
        product = Product.objects.get(id=product_id)
        user = request.user
        
        # Buscar sala donde el usuario es comprador o vendedor
        room = ChatRoom.objects.filter(
            product=product
        ).filter(
            Q(buyer=user) | Q(seller=user)
        ).first()
        
        if room:
            serializer = ChatRoomSerializer(room, context={'request': request})
            return Response(serializer.data)
        else:
            return Response(
                {'message': 'No existe sala de chat para este producto'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
    except Product.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
