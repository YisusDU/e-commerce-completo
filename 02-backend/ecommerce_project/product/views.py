from django.shortcuts import render
from django.views.generic import ListView
from .models import Product
from datetime import datetime

from rest_framework import generics
from .pagination import ProductPagination
from .serializers import ProductSerializer


class ProductListView(ListView): 
    model = Product
    template_name = "product/product_list.html"

    # modificamos el contexto para añadir un título
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["title"] = "CATÁLOGO DE PRODUCTOS"
        context["today"] = datetime.now().today()
        return context

# API View con paginación
class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = ProductPagination