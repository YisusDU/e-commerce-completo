# En account/authentication_backends.py
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailAuthBackend(ModelBackend):
    """
    Autentica usando el email.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        
        # El frontend enviará 'email' como el campo 'username' en el JSON.
        # O, si simplejwt es lo suficientemente listo, como 'email'.
        # Este backend maneja ambos casos.
        
        email = kwargs.get('email', username) # Acepta 'email' o 'username' como el email

        try:
            # Busca al usuario por su email
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None # No se encontró usuario, este backend no autentica

        # Verifica la contraseña
        if user.check_password(password):
            return user # ¡Usuario y contraseña correctos!
        
        return None # Contraseña incorrecta

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None