from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token 
from rest_framework import status  
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

from .serializers import UserSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated 


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Vista de login que usa nuestro serializer personalizado.
    """
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registration_view(request):

    if request.method == "POST":
        serializer = UserSerializer(data=request.data)

        data = {}


        if serializer.is_valid():
            account = serializer.save()
            data["response"] = "Registro  Exitoso!"
            data["username"] = account.username
            data["email"] = account.email
            refresh_token = RefreshToken.for_user(account) # Con esto nos regresa el nuevo token
            data["token"] = {
                "refresh": str(refresh_token),
                "access": str(refresh_token.access_token)
            }
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            return Response({"error":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


    
# Vista del perfil de usuario
class UserProfileView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "username": user.username,
            "email": user.email,
        }
        return Response(data)