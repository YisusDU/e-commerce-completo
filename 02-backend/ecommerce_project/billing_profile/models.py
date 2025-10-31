from django.conf import settings
from django.db import models
from django.db.models.signals import pre_save, post_save
from django.urls import reverse
import uuid # importar la librería uuid para generar identificadores únicos
User = settings.AUTH_USER_MODEL

class BillingProfile(models.Model):
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
    email = models.EmailField()
    active = models.BooleanField(default=True)
    update = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    customer_id = models.CharField(max_length=120, null=True, blank=True)

    def __str__(self):
        return self.email
    
    # Generar un customer_id único
    def save(self, *args, **kwargs):
        if not self.customer_id:
            self.customer_id = str(uuid.uuid4())
        super().save(*args, **kwargs)


