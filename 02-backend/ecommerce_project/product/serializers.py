from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ProductSerializerView(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["title", "description", "price"]