from django.urls import path 
from .views import (
    UserCreateView, LoginView, LogoutView, RefreshTokenView,
    ProfileDetailUpdateView, CreateProfileView, PublicProfileDetailView
    )

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('register/', UserCreateView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('refresh/', RefreshTokenView.as_view()),
    path('profile/me/', ProfileDetailUpdateView.as_view(), name='profile-detail-update'),
    path("profile/create/", CreateProfileView.as_view(), name="create-profile"),
    path('profile/<uuid:id>/', PublicProfileDetailView.as_view(), name='public-profile'),
]
