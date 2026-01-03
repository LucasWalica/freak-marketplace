from django.urls import path
from .views import ( 
    CreateProductView, ListProductsByOwnerView, ListProductsView, 
    UpdateProductView, DeleteProductView
)

urlpatterns = [
    path('create/', CreateProductView.as_view(), name='create-product'),
    path('my-products/', ListProductsByOwnerView.as_view(), name='list-products-by-owner'),
    path('products/', ListProductsView.as_view(), name='list-products'),
    path('update/<uuid:pk>/', UpdateProductView.as_view(), name='update-product'),
    path('delete/<uuid:pk>/', DeleteProductView.as_view(), name='delete-product'),
]
