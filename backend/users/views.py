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
            return Response({'error':"invalid credentialds"}, status=401)

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "token":token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }, status=201)
    
#login 
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        username = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        

        if user is not None:
            access = AccessToken.for_user(user)
            refresh = AccessToken.for_user(user)
            response = JsonResponse({
                "user": UserSerializer(user).data,
                "message": "Login successful"
            })      
            # Cookie JWT Django
            response.set_cookie(
                key="access_token",
                value=str(access),
                httponly=True,
                secure=False,      # local
                samesite="Lax",    # <----- cambiar aquí
                max_age=3600,
                path="/"
            )
            return response
        else:
            return Response({"error": "Invalid credentials"}, status=401)
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
        return self.request.user.profile


class PublicProfileDetailView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
