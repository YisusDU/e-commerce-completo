import math
import datetime
from django.conf import settings
from django.db import models
from django.db.models import Sum, Count, Avg
from django.db.models.signals import pre_save, post_save
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta

from address.models import Address
from billing_profile.models import BillingProfile
from cart.models import Cart
#from ecommerce.utils import unique_order_id_generator  <---comentado temporal
from product.models import Product



class OrderManagerQueryset(models.query.QuerySet):
    def recent(self):
        return self.order_by("-updated", "-timestamp")
    
    def get_sales_breakdown(self): 
        recent = self.recent().not_refunded()
        recent_data = recent.totals_data()
        recent_cart_data = recent.cart_data()
        shipped = recent.by_status(status="shipped")
        shipped_data = shipped.totals_data()
        paid = recent.by_status(status="paid")
        paid_data = paid.totals_data()
        data = {
            "recent": recent,
            "recent_data": recent_data,
            "recent_cart_data": recent_cart_data,
            "shipped": shipped,
            "shipped_data": shipped_data,
            "paid": paid,
            "paid_data": paid_data
        }
    
    def by_status(self, status='shipped'):
        return self.filter(status=status)
    
    def not_refunded(self):
        return self.exclude(status='refunded')
    
    def not_created(self):
        return self.exclude(status='created')
    
    def by_range(self, start_date, end_date=None): 
        if end_date == None:
            return self.filter(updated__gte=start_date)
        return self.filter(updated__gte=start_date).filter(updated__lte=end_date)
    
    def totals_data(self): 
        return self.aggregate(Sum("total"), Avg("total")) 
    
    def by_weeks_range(self, weeks_ago=7, number_of_weeks=2):
        if number_of_weeks > weeks_ago:
            number_of_weeks = weeks_ago
        days_ago_start = weeks_ago * 7
        days_ago_end = days_ago_start - (number_of_weeks * 7)
        start_date = timezone.now() - timedelta(days=days_ago_start) 
        end_date = timezone.now() - timedelta(days=days_ago_end)
        return self.by_range(start_date, end_date=end_date)
    
class OrderManager(models.Manager):
    def get_queryset(self):
        return OrderManagerQueryset(self.model, using=self._db)
    
    def by_request(self, request):
        return self.get_queryset().by_request(request)
    
    def new_or_get(self, billing_profile, cart_obj):
        created = False
        qs = self.get_queryset().filter(
            billing_profile=billing_profile, 
            cart = cart_obj, active=True, 
            status='created'
        )
        if qs.count() == 1:
            obj = qs.first()
        else:
            obj = self.model.objects.create(
                billing_profile=billing_profile,
                cart=cart_obj
            )
            created = True
        return obj, created
    
