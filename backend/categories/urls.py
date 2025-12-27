from django.urls import path
from .views import CategoryListView, CategoryDetailView

urlpatterns = [
    path("categories/", CategoryListView.as_view()),
    path("categories/<int:id>/", CategoryDetailView.as_view()),
]
