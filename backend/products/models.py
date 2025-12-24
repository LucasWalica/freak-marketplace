from django.db import models
from categories.models import Category
from django.contrib.auth.models import User
import uuid
from django.utils import timezone

# Create your models here.
class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Atributos dinámicos según el schema de la categoría
    # Ejemplo: {"Estado": "Mint", "Rareza": "Ultra Rare"}
    specifications = models.JSONField(default=dict)
    
    # Imágenes guardadas como lista de URLs de Firebase
    images = models.JSONField(default=list) 
    
    # Lógica de Monetización (Buffs)
    is_boosted = models.BooleanField(default=False)
    BOOST_CHOICES = [
        ('NONE', 'None'),
        ('NEON', 'Neon Green'),
        ('GOLD', 'Gold Edition'),
    ]
    boost_type = models.CharField(max_length=10, choices=BOOST_CHOICES, default='NONE')
    boost_expires_at = models.DateTimeField(null=True, blank=True)

    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('RESERVED', 'Reserved'),
        ('SOLD', 'Sold'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='AVAILABLE')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    @property
    def is_boost_active(self):
        if self.is_boosted and self.boost_expires_at:
            return self.boost_expires_at > timezone.now()
        return False