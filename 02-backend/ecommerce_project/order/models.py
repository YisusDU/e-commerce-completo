# en order/models.py
from django.db import models
from django.conf import settings
from django.db.models import Sum, Avg
from django.utils import timezone
from datetime import timedelta


from product.models import Product       # Importa tu Product
from address.models import Address       # Importa tu Address
from billing_profile.models import BillingProfile # Importa tu BillingProfile

User = settings.AUTH_USER_MODEL

# --- ¡NUEVO QUERYSET! ---
# Esto le da los superpoderes a Order.objects.all()
class OrderQuerySet(models.query.QuerySet):
    
    def by_status(self, status='paid'):
        return self.filter(status=status)

    def not_refunded(self):
        # Tu nuevo modelo no tiene 'refunded', así que
        # asumiremos que "no reembolsado" significa "pagado" o "enviado".
        return self.exclude(status='created') 

    def recent(self):
        # Tu nuevo modelo usa 'created_at'
        return self.order_by("-created_at")

    def by_range(self, start_date, end_date=None): 
        if end_date is None:
            return self.filter(created_at__gte=start_date)
        return self.filter(created_at__gte=start_date).filter(created_at__lte=end_date)

    def by_weeks_range(self, weeks_ago=1, number_of_weeks=1):
        if number_of_weeks > weeks_ago:
            number_of_weeks = weeks_ago
        days_ago_start = weeks_ago * 7
        days_ago_end = days_ago_start - (number_of_weeks * 7)
        start_date = timezone.now() - timedelta(days=days_ago_start) 
        end_date = timezone.now() - timedelta(days=days_ago_end)
        return self.by_range(start_date, end_date=end_date)

    def totals_data(self):
        # ¡IMPORTANTE! Agregamos sobre 'total_amount' (tu nuevo campo)
        return self.aggregate(total_amount__sum=Sum("total_amount"), total_amount__avg=Avg("total_amount"))

# --- ¡NUEVO MANAGER! ---
class OrderManager(models.Manager):
    def get_queryset(self):
        return OrderQuerySet(self.model, using=self._db)
    
    # Hacemos que todos los métodos del QuerySet estén disponibles
    def all(self):
        return self.get_queryset()

    def by_weeks_range(self, weeks_ago=1, number_of_weeks=1):
        return self.get_queryset().by_weeks_range(weeks_ago, number_of_weeks)
    
    def recent(self):
        return self.get_queryset().recent()

    def not_refunded(self):
        return self.get_queryset().not_refunded()
        
    def by_status(self, status='paid'):
        return self.get_queryset().by_status(status)


class Order(models.Model):
    # QUIÉN: El interceptor de JWT nos dará el usuario
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    # DÓNDE: El ID que nos enviará el frontend
    shipping_address = models.ForeignKey(Address, related_name='shipping_orders', on_delete=models.SET_NULL, null=True)
    
    # PAGO (Opcional, pero bueno tenerlo):
    # Asumimos que la dirección y el pago están en el mismo perfil
    billing_profile = models.ForeignKey(BillingProfile, on_delete=models.SET_NULL, null=True)
    
    # QUÉ: Los totales calculados de forma SEGURA en el backend
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # ESTADO:
    status = models.CharField(max_length=20, default='created', choices=(
        ('created', 'Creada'), ('paid', 'Pagada'), ('shipped', 'Enviada')
    ))
    created_at = models.DateTimeField(auto_now_add=True)

    objects = OrderManager()
    
    def __str__(self):
        return f"Order {self.id} - {self.user.username}"

class OrderItem(models.Model):
    # VINCULACIÓN: Cada item pertenece a una Orden
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    
    # REFERENCIA: A qué producto se refería
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    
    # --- ¡LA MAGIA DEL "SNAPSHOT"! ---
    # COPIAMOS los datos en el momento de la compra
    product_title_snapshot = models.CharField(max_length=255)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    # --- Fin de la Magia ---
    
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product_title_snapshot}"