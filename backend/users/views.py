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
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
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
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "token":token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            }, status=200)
        else:
            return Response({"error": "Invalid credentials"}, status=401)
#logout 
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    def post(self, request):
        request.user.auth_token.delete()
        return Response({'message':"user logout succesfully"}, status=200)    
    


# profile views 
class CreateProfileView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user 
        profile = serializer.save(user=user)
        if not profile:
            return Response({"error":"invalid credentials"}, status=401)
        
        return Response({"message":"profile created succesfully"}, status=201)


class ProfileDetailUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        # Esto garantiza que el usuario logueado obtenga SU perfil 
        # sin necesidad de pasar el ID en la URL.
        return self.request.user.profile


class PublicProfileDetailView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication] 
    lookup_field = 'id' 
    