# en order/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem
from product.models import Product  # Para leer 'price' y 'title'
from address.models import Address  # Para validar la dirección
import math # Para redondear

class OrderItemPayloadSerializer(serializers.Serializer):
    """ Serializer solo para validar el payload de entrada: {product_id, quantity} """
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class OrderCreateSerializer(serializers.ModelSerializer):
    """
    Serializer principal para CREAR la orden.
    Este es el "atajo": asume que el pago fue exitoso.
    """
    
    # --- CAMPOS DE ENTRADA (Write-Only) ---
    # Esto es lo que esperamos que envíe el frontend
    items = OrderItemPayloadSerializer(many=True, write_only=True)
    shipping_address_id = serializers.IntegerField(write_only=True)

    # --- CAMPOS DE SALIDA (Read-Only) ---
    # Para anidar los items creados en la respuesta JSON
    created_items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 
            'shipping_address_id',  # Entrada
            'items',                # Entrada
            'created_items',        # Salida
            'total_amount',          # Salida (calculado)
            'status',               # Salida (calculado)
            'created_at'            # Salida
        )
        read_only_fields = ('id', 'total_amount', 'status', 'created_at', 'created_items')

    def get_created_items(self, obj):
        # Devuelve los items recién creados en el JSON de respuesta
        # (Esto es opcional, pero muy útil para el frontend)
        items = obj.items.all()
        return [
            {
                "product": item.product.id,
                "title": item.product_title_snapshot,
                "price": item.price_at_purchase,
                "quantity": item.quantity
            } for item in items
        ]

    def create(self, validated_data):
        # 1. OBTENER DATOS
        items_data = validated_data.pop('items')
        address_id = validated_data.pop('shipping_address_id')
        user = self.context['request'].user # ¡Gracias al interceptor!

        # 2. VALIDAR LA DIRECCIÓN
        try:
            # Validamos que la dirección exista Y sea del usuario
            shipping_address = Address.objects.get(id=address_id, billing_profile__user=user)
        except Address.DoesNotExist:
            raise serializers.ValidationError("Dirección no válida o no pertenece al usuario.")

        # 3. CREAR LA ORDEN (Aún sin total)
        order = Order.objects.create(
            user=user,
            shipping_address=shipping_address,
            billing_profile=shipping_address.billing_profile, # Asumimos que es el mismo
            status='paid' # <-- ¡EL ATAJO! Asumimos que ya está pagada.
        )

        total = 0
        items_para_crear_en_db = []

        # 4. ITERAR Y CALCULAR TOTAL (¡LA PARTE SEGURA!)
        for item_data in items_data:
            try:
                # Buscamos el producto real en la DB
                product = Product.objects.get(id=item_data['product_id'])
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Producto ID {item_data['product_id']} no existe.")
            
            # ¡Usamos el precio del BACKEND, no del frontend!
            price = product.price 
            quantity = item_data['quantity']
            total += price * quantity
            
            # Preparamos el "snapshot"
            items_para_crear_en_db.append(
                OrderItem(
                    order=order,
                    product=product,
                    product_title_snapshot=product.title, # Snapshot del título
                    price_at_purchase=price,              # Snapshot del precio
                    quantity=quantity
                )
            )

        # 5. GUARDAR TODO
        # Creamos todos los items en una sola consulta
        OrderItem.objects.bulk_create(items_para_crear_en_db) 
        
        # Guardamos el total seguro en la orden
        order.total_amount = round(total, 2)
        order.save()
        
        return order