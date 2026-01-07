from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    # Vistas de API REST
    path('rooms/', views.ChatRoomListView.as_view(), name='chatroom-list'),
    path('rooms/<uuid:pk>/', views.ChatRoomDetailView.as_view(), name='chatroom-detail'),
    path('rooms/<uuid:room_id>/messages/', views.MessageListView.as_view(), name='message-list'),
    path('rooms/create/', views.create_chat_room, name='create-chatroom'),
    path('rooms/<uuid:room_id>/mark-read/', views.mark_messages_read, name='mark-messages-read'),
    path('product/<int:product_id>/room/', views.get_chat_room_for_product, name='chatroom-for-product'),
]
