from django.urls import path
from sales import views

urlpatterns = [
    path("sales", views.SalesView.as_view(), name="sales-analytics"), #<--- añadido
    path("sales/data", views.SalesAjaxView.as_view(), name="sales-data"),
]