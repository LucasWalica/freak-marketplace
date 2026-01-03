from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    """Permiso personalizado para verificar que el usuario es el propietario del producto"""
    def has_object_permission(self, request, view, obj):
        return obj.seller == request.user
