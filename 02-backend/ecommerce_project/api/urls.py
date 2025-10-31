from django.urls import path, include #<-- import include
from rest_framework.routers import DefaultRouter #<-- import DefaultRouter
from .views import (
    ProductAPIView, 
    ProductAPIModify,
    UserViewSet, #<-- import UserViewSet
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register("users", UserViewSet, basename="users") #<-- register the UserViewSet with the router

urlpatterns = [
    path("", ProductAPIView.as_view(), name="product-api"),
    path("<int:pk>/", ProductAPIModify.as_view(), name="product-api-modify"),
    path("", include(router.urls)), #<-- include the router URLs
]