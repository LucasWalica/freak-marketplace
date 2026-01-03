from django.shortcuts import render
from .serializers import ProductSerializer
from .models import Product
from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .pagination import ProductPagination
from .permissions import IsOwner


class CreateProductView(generics.CreateAPIView):
    """Vista para crear un nuevo producto"""
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        # El producto se asigna automáticamente al usuario autenticado
        serializer.save(seller=self.request.user)


class ListProductsByOwnerView(generics.ListAPIView):
    """Vista para listar productos del propietario autenticado"""
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ProductPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price', 'is_boosted']
    ordering = ['-is_boosted', '-created_at']
    
    def get_queryset(self):
        """Retorna solo los productos del usuario autenticado"""
        return Product.objects.filter(seller=self.request.user).order_by('-is_boosted', '-created_at')


class ListProductsView(generics.ListAPIView):
    """Vista para listar todos los productos con filtros y búsqueda"""
    serializer_class = ProductSerializer
    permission_classes = []
    pagination_class = ProductPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'boost_type']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price', 'is_boosted']
    ordering = ['-is_boosted', '-created_at']
    
    def get_queryset(self):
        """Retorna todos los productos ordenados por boosted primero"""
        return Product.objects.all().order_by('-is_boosted', '-created_at')


class UpdateProductView(generics.UpdateAPIView):
    """Vista para actualizar un producto (solo el propietario puede hacerlo)"""
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    queryset = Product.objects.all()


class DeleteProductView(generics.DestroyAPIView):
    """Vista para eliminar un producto (solo el propietario puede hacerlo)"""
    permission_classes = [IsAuthenticated, IsOwner]
    queryset = Product.objects.all() 


