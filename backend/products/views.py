from django.shortcuts import render
from .serializers import ProductSerializer
from .models import Product
from rest_framework import generics, filters, status, views
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .pagination import ProductPagination
from .permissions import IsOwner
from services.firebase_service import FirebaseStorageService
from django.conf import settings


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

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  # Esto hace que el PUT se comporte como un PATCH
        return super().update(request, *args, **kwargs)

class DetailProductView(generics.RetrieveAPIView):
    """Vista para obtener los detalles de un producto específico"""
    serializer_class = ProductSerializer
    permission_classes = []
    queryset = Product.objects.all()


class UploadImagesView(views.APIView):
    """Vista para subir imágenes a Firebase Storage"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        try:
            files = request.FILES.getlist('images')
            
            if not files:
                return Response(
                    {'error': 'No se proporcionaron imágenes'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if len(files) > settings.MAX_IMAGES_PER_PRODUCT:
                return Response(
                    {'error': f'Máximo {settings.MAX_IMAGES_PER_PRODUCT} imágenes permitidas'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            firebase_service = FirebaseStorageService()
            uploaded_urls = []
            errors = []
            
            for i, image_file in enumerate(files):
                # Validar tipo de archivo
                if image_file.content_type not in settings.ALLOWED_IMAGE_TYPES:
                    errors.append(f'Imagen {i+1}: Tipo de archivo no permitido')
                    continue
                
                # Validar tamaño
                if image_file.size > settings.MAX_IMAGE_SIZE:
                    errors.append(f'Imagen {i+1}: Tamaño máximo excedido (10MB)')
                    continue
                
                url = firebase_service.upload_image(image_file, folder='products')
                if url:
                    uploaded_urls.append(url)
                else:
                    errors.append(f'Imagen {i+1}: Error al subir')
            
            if errors:
                return Response({
                    'urls': uploaded_urls,
                    'errors': errors,
                    'message': f'Subidas {len(uploaded_urls)} de {len(files)} imágenes'
                }, status=status.HTTP_207_MULTI_STATUS)
            
            return Response({
                'urls': uploaded_urls,
                'message': f'Se subieron {len(uploaded_urls)} imágenes exitosamente'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error al procesar las imágenes: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DeleteProductView(generics.DestroyAPIView):
    """Vista para eliminar un producto (solo el propietario puede hacerlo)"""
    permission_classes = [IsAuthenticated, IsOwner]
    queryset = Product.objects.all() 
    
    def perform_destroy(self, instance):
        # Eliminar imágenes de Firebase antes de eliminar el producto
        if instance.images:
            firebase_service = FirebaseStorageService()
            for image_url in instance.images:
                firebase_service.delete_image(image_url)
        
        super().perform_destroy(instance)
