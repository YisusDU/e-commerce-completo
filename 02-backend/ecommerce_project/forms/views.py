from django.shortcuts import render , redirect
from django.db import transaction
from django.urls import reverse

from .forms import UserModelForm, BillingProfileForm, AddressModelForm

def user_create_view(request):
    alert_message = None
    if request.method == 'POST':
        user_form = UserModelForm(request.POST or None)
        billing_form = BillingProfileForm(request.POST or None)
        address_form = AddressModelForm(request.POST or None)
        if user_form.is_valid() and billing_form.is_valid() and address_form.is_valid():
            # Usamos una transacción para asegurar que todas las operaciones se completen correctamente
            with transaction.atomic():
                # Guardar usuario
                user = user_form.save(commit=False)
                user.set_password(user_form.cleaned_data['password'])
                user.save()
                
                # Guardar BillingProfile y asociar usuario
                billing_profile = billing_form.save(commit=False)
                billing_profile.user = user
                billing_profile.email = user.email
                billing_profile.save()
                
                # Guardar Address y asociar usuario y billing_profile
                address = address_form.save(commit=False)
                address.nickname = user.username  
                address.billing_profile = billing_profile  
                address.save()
            alert_message = "¡Usuario creado exitosamente!"
            # Limpiar los formularios después de guardar
            user_form = UserModelForm()
            billing_form = BillingProfileForm()
            address_form = AddressModelForm()
    else:
        user_form = UserModelForm()
        billing_form = BillingProfileForm()
        address_form = AddressModelForm()
    context = {
        'user_form': user_form,
        'billing_form': billing_form,
        'address_form': address_form,
        'alert_message': alert_message
    }
    return render(request, "forms/user_create.html", context)