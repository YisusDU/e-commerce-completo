from django.urls import path

from forms import views

urlpatterns = [
    path("", views.user_create_view, name="user-register"),    
]