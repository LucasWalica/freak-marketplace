from django.db import models
import uuid
# Create your models here.
class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Ejemplo name: {"es": "Cartas Pokémon", "en": "Pokémon Cards"}
    name = models.JSONField(default=dict) 
    slug = models.SlugField(unique=True)
    # Ejemplo schema: ["Estado", "Rareza", "Idioma", "Edición"]
    schema = models.JSONField(default=list) 
    icon = models.CharField(max_length=50, blank=True) # Clase de FontAwesome o similar

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.slug