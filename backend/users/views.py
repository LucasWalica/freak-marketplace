from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework import generics
from .serializers import UserSerializer, ProfileSerializer
from .models import Profile
from rest_framework.response import Response
from django.contrib.auth.models import User 
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
# Create your views here.


# register
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if not user:
            return Response({'error':"invalid credentials"}, status=401)

        # Create profile for the new user
        try:
            Profile.objects.get_or_create(user=user)
        except Exception as e:
            # Log the error but don't fail the registration
            print(f"Error creating profile: {e}")

        return Response({
            "message": "Usuario creado exitosamente",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
        }, status=201)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Se requieren usuario y contraseña"}, status=400)

        # Autenticación (mejorada)
        user = authenticate(request, username=username, password=password)
        
        # Si no autentica por username, intentamos por email manualmente
        if user is None:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user_obj = User.objects.get(email=username)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if user is not None:
            # Generar Token
            access = AccessToken.for_user(user)
            
            # Crear la respuesta usando Response de DRF
            response = Response({
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "message": "Login successful"
            }, status=200)

            # Seteamos la cookie en el objeto response de DRF
            response.set_cookie(
                key="access_token",
                value=str(access),
                httponly=True,   # Mantener por seguridad
                secure=False,    # Obligatorio False para HTTP
                samesite="Lax",  # String "Lax" con mayúscula
                path="/",        # Raíz
                max_age=3600,    # 1 hora en segundos (60 minutos)
            )
            return response
        
        return Response({"error": "Credenciales inválidas"}, status=401)

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        raw_token = request.COOKIES.get("access_token")
        if not raw_token:
            return Response({"error": "No token provided"}, status=401)
            
        try:
            from rest_framework_simplejwt.tokens import AccessToken
            # Validar el token existente
            token = AccessToken(raw_token)
            
            # Si el token es válido, simplemente devolvemos una respuesta exitosa
            # El frontend usará esto para saber que la sesión sigue activa
            return Response({"message": "Token is valid"}, status=200)
            
        except Exception as e:
            return Response({"error": "Token inválido o expirado"}, status=401)

#logout 
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        response = Response({'message':"user logout successfully"}, status=200)
        response.delete_cookie('access_token', path='/')
        return response    
    


# profile views 
class CreateProfileView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user 
        profile = serializer.save(user=user)
        if not profile:
            return Response({"error":"invalid credentials"}, status=401)
        
        return Response({"message":"profile created successfully"}, status=201)


class ProfileDetailUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Esto garantiza que el usuario logueado obtenga SU perfil 
        # sin necesidad de pasar el ID en la URL.
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile


class PublicProfileDetailView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
