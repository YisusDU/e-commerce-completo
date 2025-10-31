from django.db import models
from django.urls import reverse

from billing_profile.models import BillingProfile
from address.models import Address
from cart.models import Cart
from order_manager.models import OrderManager 

ORDER_STATUS_CHOICES = (
    ('created', 'Created'),
    ('paid', 'Paid'),
    ('shipped', 'Shipped'),
    ('refunded', 'Refunded'),
)

class Order(models.Model):
    billing_product = models.ForeignKey(BillingProfile, null=True, blank=True, on_delete=models.DO_NOTHING) 
    order_id = models.CharField(max_length=120, blank=True)
    shipping_address = models.ForeignKey(Address, related_name="shipping_address", null=True, blank=True, on_delete=models.DO_NOTHING) 
    billing_address = models.ForeignKey(Address, related_name="billing_address", null=True, blank=True, on_delete=models.DO_NOTHING) 
    cart = models.ForeignKey(Cart, on_delete=models.DO_NOTHING) 
    status = models.CharField(max_length=120, default='created', choices=ORDER_STATUS_CHOICES)
    shipping_total = models.DecimalField(default=5.99, max_digits=100, decimal_places=2)
    total = models.DecimalField(default=0, max_digits=100, decimal_places=2)
    active = models.BooleanField(default=True)
    updated = models.DateTimeField() # auto_now=True removido temporalmente
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.order_id
    
    objects = OrderManager()

    class Meta:
        ordering = ['-timestamp', '-updated']

    def get_absolute_url(self):
        return reverse("orders:detail", kwargs={"order_id": self.order_id})
    
    def get_status(self):
        if self.status == "refunded":
            return "Refunded order"
        elif self.status == "shipped":
            return "Shipped"
        return "Shipping soon"
