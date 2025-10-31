from django.shortcuts import render
from rest_framework import views, status 
from rest_framework.response import Response 
from rest_framework.viewsets import ViewSet #<-- import ViewSet
from django.shortcuts import get_object_or_404 #<-- import get_object_or_404

from product.models import Product 
from django.contrib.auth.models import User #<-- import User model
from product.serializers import ProductSerializer 
from users.serializers import UserSerializer #<-- import UserSerializer

class ProductAPIView(views.APIView):
    def get(self, request):
        # Get all products
        products = Product.objects.all() 
        serializer = ProductSerializer(products, many=True) #<-- serialize them
        content = {
            "Prueba del método GET": "Funciona",
        }
        context = {
            "estado": content,
            "products": serializer.data, #<-- return the serialized data
        }
        return Response(context, status=status.HTTP_200_OK)
    
    def post(self, request):
        # Create a new product
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            content = {
                "Prueba del método POST": "Funciona",
                "product": serializer.data,
            }
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        content = {
                "Prueba del método POST": "No Funciona",
                "errors": serializer.errors,
            }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    
    

class ProductAPIModify(views.APIView):
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return None
        
    def put(self, request, pk):
        # Update a product
        product = self.get_object(pk)
        if product is None:
            return Response({
                "success": False,
                "message": f"Producto con ID {pk} no encontrado"
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            content = {
                "Prueba del método PUT": "Funciona",
                "product": serializer.data,
            }
            return Response(content, status=status.HTTP_200_OK)
        
        content = {
                "Prueba del método PUT": "No Funciona",
                "errors": serializer.errors,
            }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        # Delete a product
        product = self.get_object(pk)
        if not product:
            return Response({
                "success": False,
                "message": f"Producto con ID {pk} no encontrado"
            }, status=status.HTTP_404_NOT_FOUND)
        
        product_name = product.title
        product.delete()
        content = {
            "Prueba del método DELETE": "Funciona",
            "product": f"El producto {product_name} ha sido eliminado",
        }
        return Response(content, status=status.HTTP_200_OK)
        

# ViewSet for User model
class UserViewSet(ViewSet):
    """ViewSet para listar usuarios"""
    serializer_class = UserSerializer #<-- we can use the ProductSerializer for simplicity
    def list(self, request):
        """Lista todos los usuarios"""
        users = User.objects.all()
        serializer = self.serializer_class(users, many=True)
        message = [
            "Lista de usuarios",
             serializer.data  
            ]
        return Response({"message": message}, status=status.HTTP_200_OK)

    def create(self, request):
        """Crea un mensaje de saludo"""
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            message = [
                "Creando un usuario con los siguientes datos:",
                data
            ]
            return Response({"message": message}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def retrieve(self, request, pk=None):
        """Maneja obtener un objeto por su ID"""
        user = get_object_or_404(User, pk=pk)
        message = {
            "message": "Obteniendo un usuario por su ID",
            "data": {
                "id": pk,
                "serializer": UserSerializer(user).data
            }
        }
        return Response({"message": message}, status=status.HTTP_200_OK)
    

    def update(self, request, pk=None):
        """Maneja la actualización completa de un objeto por su ID"""
        user = get_object_or_404(User, pk=pk)
        serializer = self.serializer_class(user, data=request.data, partial=False)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = serializer.save()
        
        return Response({
            "message": f"Usuario con ID {pk} actualizado correctamente",
            "data": UserSerializer(user).data
        }, status=status.HTTP_200_OK)


    def partial_update(self, request, pk=None):
        """Maneja la actualización parcial de un objeto por su ID"""
        user = get_object_or_404(User, pk=pk)
        serializer = self.serializer_class(user, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        data = serializer.validated_data
        message = [
            f"Actualizando parcialmente el usuario con ID {pk}",
            data
        ]
        return Response({"message": message}, status=status.HTTP_200_OK)
    
    def destroy(self, request, pk=None):
        """Maneja la eliminación de un objeto por su ID"""
        user = get_object_or_404(User, pk=pk)
        user.delete()
        message = f"Eliminando el usuario con ID {pk}"
        return Response({"message": message}, status=status.HTTP_200_OK)