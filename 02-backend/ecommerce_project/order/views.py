from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderCreateSerializer

class OrderCreateView(generics.CreateAPIView):
    """
    Endpoint para crear una nueva orden (Modo Tarea/Atajo).
    Recibe el payload del carrito del frontend.
    Asume que el pago es exitoso y crea la orden como 'pagada'.
    """
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated] # ¡Solo usuarios logueados!