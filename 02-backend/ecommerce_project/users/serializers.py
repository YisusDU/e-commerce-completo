from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=255)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def validate_username(self, value):
        #Django no permite usuarios con el mismo username
        """Validar que el username sea único"""
        user = self.instance  # None en creación, User instance en update
        
        # Si es update y el username no cambió, permitirlo
        if user and user.username == value:
            return value
        # Verificar si ya existe
        query = User.objects.filter(username=value)
        
        # Si es update, excluir el usuario actual de la búsqueda
        if user:
            query = query.exclude(pk=user.pk)
        
        if query.exists():
            raise serializers.ValidationError(
                "Este nombre de usuario ya está en uso."
            )
        return value

    def validate_email(self, value):
        """Validar que el email sea único"""
        user = self.instance
        
        # Si es update y el email no cambió, permitirlo
        if user and user.email == value:
            return value
        
        # Verificar si ya existe
        query = User.objects.filter(email=value)
        
        # Si es update, excluir el usuario actual
        if user:
            query = query.exclude(pk=user.pk)
        
        if query.exists():
            raise serializers.ValidationError(
                "Este email ya está en uso."
            )
        
        return value

    def validate(self, attrs):
        """Validaciones a nivel de objeto"""
        # Exigir password SOLO en creación
        if not self.instance and not attrs.get('password'):
            raise serializers.ValidationError({
                "password": "La contraseña es requerida para crear un usuario."
            })
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        """Actualizar usuario existente"""
        password = validated_data.pop('password', None)
        
        # Actualizar campos regulares
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        
        # Solo actualizar password si se proporcionó
        if password:
            instance.set_password(password)  # Hashea la contraseña
        
        instance.save()
        return instance