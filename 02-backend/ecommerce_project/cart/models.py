from decimal import Decimal
from django.conf import settings
from django.db import models
from django.db.models.signals import pre_save, post_save, m2m_changed

from product.models import Product

User = settings.AUTH_USER_MODEL

class Cart(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE) #<-- Añadido on_delete
    products = models.ManyToManyField(Product, blank=True)
    subtotal = models.DecimalField(default=0.0, max_digits=100, decimal_places=2)
    total = models.DecimalField(default=0.0, max_digits=100, decimal_places=2)
    update = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)
    
    @property
    def is_digital(self):
        qs = self.products.all()
        new_qs = qs.filter(is_digital=False)
        if new_qs.exists():
            return False
        return True