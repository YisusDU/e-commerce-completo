# en address/serializers.py
from rest_framework import serializers
from .models import Address
from billing_profile.models import BillingProfile # 👈 Importa tu modelo

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id', 'nickname', 'name', 'address_line_1', 'address_line_2', 
            'city', 'state', 'postal_code', 'country'
        ]
        read_only_fields = ('id',)

    def create(self, validated_data):
        # 1. Obtenemos el usuario del contexto
        user = self.context['request'].user
        validated_data.pop('request', None)
        
        # 👇 ¡AQUÍ ESTÁ LA MAGIA! ESTA LÍNEA ES TU RESPUESTA
        # 2. Intenta buscar un BillingProfile para este usuario.
        #    Si no lo encuentra, lo CREA usando los 'defaults'.
        billing_profile, created = BillingProfile.objects.get_or_create(
            user=user,
            defaults={'email': user.email} # 👈 ¡La pieza clave!
        )
        
        # 3. Creamos la dirección y le asignamos el perfil
        address = Address.objects.create(
            billing_profile=billing_profile,
            address_type="shipping",
            **validated_data
        )
        return address