from django.db import models
from django.contrib.auth.models import User
import uuid
# Create your models here.
class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    is_verified = models.BooleanField(default=False)
    avatar_url = models.URLField(blank=True, null=True) # Link de Firebase
    
    PLAN_CHOICES = [
        ('FREE', 'Free'),
        ('PRO', 'Pro'),
        ('LEGEND', 'Legend'),
    ]
    plan_type = models.CharField(max_length=10, choices=PLAN_CHOICES, default='FREE')

    def __str__(self):
        return f"Perfil de {self.user.username}"