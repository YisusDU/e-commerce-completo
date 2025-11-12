from django.urls import path, include #<-- import include
from rest_framework.routers import DefaultRouter #<-- import DefaultRouter
from .views import (
    ProductAPIView, 
    ProductAPIModify,
    UserViewSet, #<-- import UserViewSet
)
from order.views import OrderCreateView
from address.views import AddressListCreateView


# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register("users", UserViewSet, basename="users") #<-- register the UserViewSet with the router

urlpatterns = [
    path("products/", ProductAPIView.as_view(), name="product-api"),
    path("products/<int:pk>/", ProductAPIModify.as_view(), name="product-api-modify"),
    path("", include(router.urls)), #<-- include the router URLs
    path('addresses/', AddressListCreateView.as_view(), name='address-list'),
    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
]
