from django import forms

#Models
from billing_profile.models import BillingProfile
from address.models import Address
from django.contrib.auth.models import User

#ModelForms
class UserModelForm(forms.ModelForm):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password"
        ]
        help_texts = {
            'username': '',  # Dejar vacío para quitar el texto
        }
        labels = {
            'username': 'Nombre de usuario',
            'email': 'Correo electrónico',
            'password': 'Contraseña',
        }
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Tu usuario'}),
            'email': forms.EmailInput(attrs={'placeholder': 'ejemplo@correo.com'}),
            'password': forms.PasswordInput(attrs={'placeholder': 'Ingresa tu contraseña'}),
        }
    #Agregamos un campo que no está en el modelo para confirmar la contraseña
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Repite tu contraseña'}), label="Repite la contraseña")

    #Validar que las contraseñas coincidan
    def clean_password2(self, *args, **kwargs):
        password = self.cleaned_data.get("password")
        password2 = self.cleaned_data.get("password2")
        if password != password2:
            raise forms.ValidationError("Las contraseñas no coinciden")
        return password2
    
    #Validar que el email sea único
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Este correo ya está registrado.")
        return email
    
class BillingProfileForm(forms.ModelForm):
    class Meta:
        model = BillingProfile
        # Excluir campos que no queremos que el usuario modifique
        exclude = ['user', 'email', 'active', 'update', 'timestamp', 'customer_id']

class AddressModelForm(forms.ModelForm):
    class Meta:
        model = Address
        exclude = ['billing_profile', 'nickname']
        labels = {
            'name': 'Nombre completo',
            'address_type': 'Tipo de dirección',
            'address_line_1': 'Dirección línea 1',
            'address_line_2': 'Dirección línea 2',
            'city': 'Ciudad',
            'state': 'Estado/Provincia/Región',
            'postal_code': 'Código postal',
            'country': 'País',
        }
        widgets = {
            "postal_code": forms.NumberInput()
        }
    # Validar que el código postal sea un número positivo y tenga al menos 4 dígitos
    def clean_postal_code(self):
        postal_code = self.cleaned_data.get('postal_code')
        if len(str(postal_code)) < 4 or int(postal_code) < 0:
            raise forms.ValidationError("El código postal es inválido.")
        return postal_code