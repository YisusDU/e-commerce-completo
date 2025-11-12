# en address/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Address
from .serializers import AddressSerializer

class AddressListCreateView(generics.ListCreateAPIView):
    """
    GET: Devuelve una lista de las direcciones del usuario logueado.
    POST: Crea una nueva dirección para el usuario logueado.
    """
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # ¡AQUÍ ESTÁ LA MAGIA DE LECTURA!
        # Filtramos Address -> por billing_profile -> por user
        return Address.objects.filter(billing_profile__user=self.request.user)

    def perform_create(self, serializer):
        # POST: Pasa el 'request' al serializer para que pueda encontrar al 'user'
        serializer.save(request=self.request)