from django.urls import path
from product.views import ProductListView, ProductListAPIView

urlpatterns = [
    path("", ProductListView.as_view(), name="example_product_list"),
    path("api/", ProductListAPIView.as_view(), name="api_product_list"), # Nueva ruta para la API
]