from django.urls import path
from .views import ( 
    CreateProductView, ListProductsByOwnerView, ListProductsView, 
    UpdateProductView, DeleteProductView, DetailProductView, UploadImagesView
)

urlpatterns = [
    path('', ListProductsView.as_view(), name='list-products'),
    path('create/', CreateProductView.as_view(), name='create-product'),
    path('upload-images/', UploadImagesView.as_view(), name='upload-images'),
    path('<uuid:pk>/', DetailProductView.as_view(), name='detail-product'),
    path('my-products/', ListProductsByOwnerView.as_view(), name='list-products-by-owner'),
    path('update/<uuid:pk>/', UpdateProductView.as_view(), name='update-product'),
    path('delete/<uuid:pk>/', DeleteProductView.as_view(), name='delete-product'),
]
