from django.db import models
from django.db.models.signals import pre_save 
from django.utils.text import slugify


class Product(models.Model):
    title = models.CharField(max_length=120)
    slug = models.SlugField(blank=True, null=True, db_index=True)
    description = models.TextField()
    price = models.FloatField(default=39.99)
    imageUrl = models.URLField(null=True, blank=True)
    category = models.CharField(max_length=120, null=True)
    featured = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    timestamp = models.DateField(auto_now_add=True)
    is_digital = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return f"/products/{self.slug}"
    
def slugify_pre_save(sender, instance, *args, **kwargs):
    if instance.slug is None or instance.slug == "":
        new_slug = slugify(instance.title)
        MyModel = instance.__class__
        qs = MyModel.objects.filter(slug__startswith=new_slug).exclude(id=instance.id)
        if qs.count() == 0:
            instance.slug = new_slug
        else:
            instance.slug = f"{new_slug}-{qs.count()}"

pre_save.connect(slugify_pre_save, sender=Product)