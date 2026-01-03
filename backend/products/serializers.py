from .models import Product
from rest_framework import serializers


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def validate(self, data):
        category = data.get('category')
        specs = data.get('specifications', {})
        
        # Validamos que todas las llaves del schema de la categoría estén en specs
        for field in category.schema:
            if field not in specs:
                raise serializers.ValidationError(f"Falta el campo obligatorio: {field}")
        
        return data