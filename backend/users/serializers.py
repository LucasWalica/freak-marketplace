from django.contrib.auth.models import User
from .models import Profile
from rest_framework import serializers
from django.core.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=30)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=30)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("Este correo electrónico ya está registrado.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise ValidationError("Este nombre de usuario ya está registrado.")
        return value
    
    def validate_password(self, value):
        if len(value) < 8:
            raise ValidationError("La contraseña debe tener al menos 8 caracteres.")
        # Check for at least one uppercase letter and one digit
        if not any(c.isupper() for c in value):
            raise ValidationError("La contraseña debe contener al menos una letra mayúscula.")
        if not any(c.isdigit() for c in value):
            raise ValidationError("La contraseña debe contener al menos un número.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise ValidationError("Las contraseñas no coinciden.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')  # Remove password2 as it's not needed for user creation
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
    
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'rating', 'is_verified', 'avatar_url', 'plan_type']
        # Importante: El rating y is_verified deberían ser read_only para que el usuario no se los cambie a sí mismo
        read_only_fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rating', 'is_verified']
    
    def validate_avatar_url(self, value):
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("La URL debe comenzar con http:// o https://")
        return value
