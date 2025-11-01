# Entrega del quinto proyecto m66

## ¿Qué tal practicar?

**Objetivo**

Con lo aprendido a lo largo de la profesión el alumno integrará todos los elementos desarrollados para tener un e-commerce funcional.

**Antes de comenzar**

Considera que este proyecto es la continuación del proyecto entregado en la parte de Frontend y en el módulo anterior, por lo que será necesario que lo tengas a la mano pues en el siguiente módulo se utilizará

**Paso a paso:**

Hasta ahorita ya desarrollaste la estructura y estilos de tu e-commerce y la interactividad. Además, ya creaste la estructura para almacenar los datos, los usuarios, los productos y la funcionalidad de tu e-commerce. Ahora es momento de integrar. Sigue las instrucciones:

* En el lado del frontend empezaremos a realizar peticiones HTTP a los distintos endpoints del backend para poder realizar las diferentes funciones como el registro de usuarios o la obtención de datos.
* Usaremos Axios para realizar las peticiones al backend.
* Puedes crear un custom hook en React para el manejo de las peticiones o realizarlas aisladamente en cada componente según lo necesario.
* En los request GET recuerda usar los fundamentos de listas y keys dentro de React para poder desplegar los datos correctamente.
* El uso de useEffect en los request es fundamental, asegura que los ciclos de vida de tus componentes se ejecuten adecuadamente con relación al flujo de los requests y de los momentos en que se tienen que realizar.

#### Backend

* En lado del Backend integra los modelos que creaste para las distintas aplicaciones:

  * Accounts - Cuentas
  * Addresses - direcciones
  * Analytics - métricas
  * Billing - pagos
  * Order - órdenes
  * Products - productos
* Agrega las vistas que creaste con sus endpoints correspondientes.
* Añade el código de tu proyecto de Github con el nombre “e-commerce completo”.
* En un archivo de Pdf pon el link a tu repositorio y copia y pega el código que creaste y súbelo a la plataforma.

**¿Cómo presentar su entrega?**

Enlace a GitHub

**Tiempo estimado de resolución: **180 minutos

---

## Comenzando

Lo primero fue hacer un pull de los repositorios correspondientes al frontend y backend, en sus últimas versiones, claro, eliminar el archivo .git de cada uno y unir la data en el contenedor e-commerce-completo

### Instalación de dependencias

Adicionalmente instalé las dependencias del frontend:

- \e-commerce-completo\01-frontend\mini-store

```
npm install
```

Y las del backend, activando el ambiente virtual, el comando de activación varea un poco de las versiones pasadas, pues antes mi terminal por defecto en VS code era Powershell, y ahora es git bash

- \e-commerce-completo\02-backend

```
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
cd ecommerce_project/
python manage.py runserver
```

Como pueden ver, al final de los comandos para backen ejecuté el servidor en local para comprobar que estaba funcionando bien

- http://127.0.0.1:8000/api/v1/user-viewset/

![1761936230808](image/readme/1761936230808.png)

- http://127.0.0.1:8000/api/v1/

![1761936355501](image/readme/1761936355501.png)

## Refactorizar la estructura de la respuesta API ?

Como vimos en las imágenes pasadas, mis productos están dentro de la key products y mis usuarios están dentro de messages, pero en la api que consumía antes, se veía así:

![1761941051831](image/readme/1761941051831.png)

Por lo que considero necesario estandarizar la forma en que responde la api

- \e-commerce-completo\02-backend\ecommerce_project\api\views.py

```python
from django.shortcuts import render
from rest_framework import views, status 
from rest_framework.response import Response 
from rest_framework.viewsets import ViewSet #<-- import ViewSet
from django.shortcuts import get_object_or_404 #<-- import get_object_or_404

from product.models import Product 
from django.contrib.auth.models import User #<-- import User model
from product.serializers import ProductSerializer
from users.serializers import UserSerializer #<-- import UserSerializer

class ProductAPIView(views.APIView):
    def get(self, request):
        # Get all products
        products = Product.objects.all() 
        serializer = ProductSerializer(products, many=True) #<-- serialize them
        content = serializer.data #<-- return the serialized data
    
        return Response(content, status=status.HTTP_200_OK)
  
    def post(self, request):
        # Create a new product
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            content = {
                "Prueba del método POST": "Funciona",
                "product": serializer.data,
            }
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        content = {"error": serializer.errors}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
  
  

class ProductAPIModify(views.APIView):
    def get(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
            serializer = ProductSerializer(product)  
            return Response(serializer.data, status= status.HTTP_200_OK)  
        except Product.DoesNotExist:
            content = {"error": f"Producto con pk {pk} no encontrado"}
            return Response(content, status=status.HTTP_404_NOT_FOUND)  
    
    def put(self, request, pk):
        # Update a product
        product = Product.objects.get(pk=pk) or None
        if product is None:
            content = {"error":f"Producto con ID {pk} no encontrado"}
            return Response(content, status=status.HTTP_404_NOT_FOUND)
    
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
    
        content = {"error": serializer.errors}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
  
    def delete(self, request, pk):
        # Delete a product
        product = Product.objects.get(pk=pk)
        if not product:
            content = {"error": f"Producto con ID {pk} no encontrado"}
            return Response(content, status=status.HTTP_404_NOT_FOUND)
    
        product_name = product.title
        product.delete()
        content = {"error": f"El producto {product_name} ha sido eliminado"}
    
        return Response(content, status=status.HTTP_200_OK)
    

# ViewSet for User model
class UserViewSet(ViewSet):
    """ViewSet para listar usuarios"""
    serializer_class = UserSerializer #<-- we can use the ProductSerializer for simplicity
    def list(self, request):
        """Lista todos los usuarios"""
        users = User.objects.all()
        serializer = self.serializer_class(users, many=True)
    
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        """Crea un mensaje de saludo"""
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        content = {"error": serializer.errors}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        """Maneja obtener un objeto por su ID"""
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
  

    def update(self, request, pk=None):
        """Maneja la actualización completa de un objeto por su ID"""
        user = get_object_or_404(User, pk=pk)
        serializer = self.serializer_class(user, data=request.data, partial=False)
    
        if not serializer.is_valid():
            content = {"error": serializer.errors}
            return Response(
                content, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
        user = serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


    def partial_update(self, request, pk=None):
        """Maneja la actualización parcial de un objeto por su ID"""
        user = get_object_or_404(User, pk=pk)
        serializer = self.serializer_class(user, data=request.data, partial=True)

        if not serializer.is_valid():
            content = {"error": serializer.errors}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
    
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
  
    def destroy(self, request, pk=None):
        """Maneja la eliminación de un objeto por su ID"""
        user = get_object_or_404(User, pk=pk)
        user.delete()
        message = {"message":f"Eliminando el usuario con ID {pk}"}
        return Response( message, status=status.HTTP_200_OK)
```

Tambíen cambié en endpoint para usuarios, dejandolo simplemente en users:

- \e-commerce-completo\02-backend\ecommerce_project\api\urls.py

```python
from django.urls import path, include #<-- import include
from rest_framework.routers import DefaultRouter #<-- import DefaultRouter
from .views import (
    ProductAPIView, 
    ProductAPIModify,
    UserViewSet, #<-- import UserViewSet
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register("users", UserViewSet, basename="users") #<-- register the UserViewSet with the router

urlpatterns = [
    path("", ProductAPIView.as_view(), name="product-api"),
    path("<int:pk>/", ProductAPIModify.as_view(), name="product-api-modify"),
    path("", include(router.urls)), #<-- include the router URLs
]
```

## Armar Frontend

Ya tenemos suficiente información sobre la nueva estructura que recomendó el profe, así que iré componente por componente, tomando lo mejor de ambas versiones

### Login

Me parece sensato comenzar por el principio, de modo que he comentado todas las rutas del router, cabe resaltar que el archivo index de loginform, depende de un hook que valida el formulario e interactuaba con el store, será necesario modificarlo en el futuro

- \e-commerce-completo\01-frontend\mini-store\src\router\AppRouter.js

```js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
// import RegisterPage from "../pages/RegisterPage";
// import HomePage from "../pages/HomePage";
// import CartPage from "../pages/CartPage";
// import CheckoutPage from "../pages/CheckoutPage";
// import PostCheckoutPage from "../pages/PostCheckoutPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/post-checkout" element={<PostCheckoutPage />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;

```

Y así quedó mi componente vacío de login:

- \e-commerce-completo\01-frontend\mini-store\src\pages\LoginPage\index.js

```js
import React from "react";
import logo from "../../assets/img/logoEcomm.jpg";
import {
  LoginContainer,
  LogTitle,
  LogOptions,
  LoginImg,
  LoginSignIn,
  LoginFieldset,
} from "./styles";
import LoginForm from "../../components/LoginForm";

const LoginPage = () => {
  return (
    <LoginContainer>
      <LogOptions>
        <LoginImg />
        <LoginSignIn>
          <LogTitle>
            <img src={logo} alt="logo-store" />
            <h1>
              Welcome to <span>Mini Store</span>
            </h1>
          </LogTitle>
          <LoginForm />
        </LoginSignIn>
      </LogOptions>
    </LoginContainer>
  );
};

export default LoginPage;

```

Pero no se veía nada en la siguiente ruta, solo mensajes de error sobre los estilos

- http://localhost:3000/ebac-ea-third-proyect/login

#### styles

Como en el navegador me daba errores sobre los estilos, al revizar mi archivo app.js, podemos ver que solo tiene Global styles, pero yo anteriormente usaba un theme provider, así que envolvemos la App.js con el themeprovider

- \e-commerce-completo\01-frontend\mini-store\src\App.js

```js
import React from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "styled-components";
import Theme from "./styles";

function App() {
  return (
    <div>
      <ThemeProvider theme={Theme}>
        <GlobalStyles />
        <AppRouter />
      </ThemeProvider>
    </div>
  );
}

export default App;

```

#### El archivo de router

Tuve que hacer algunos cambios para ir paso a paso y definí una ruta base:

- \e-commerce-completo\01-frontend\mini-store\src\router\AppRouter.js

```js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
// import RegisterPage from "../pages/RegisterPage";
// import HomePage from "../pages/HomePage";
// import CartPage from "../pages/CartPage";
// import CheckoutPage from "../pages/CheckoutPage";
// import PostCheckoutPage from "../pages/PostCheckoutPage";

const AppRouter = () => {
  return (
    <Router basename="/e-commerce-completo">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/post-checkout" element={<PostCheckoutPage />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;

```

#### package.json - homepage

Al hacer el cambio anterior, también necesito actualizar el package.json, con la nueva ruta home

- \e-commerce-completo\01-frontend\mini-store\package.json

```js
{
  "name": "mini-store",
  "version": "0.1.0",
  "private": true,
  "homepage": "https://YisusDU.github.io/e-commerce-completo",
```

#### App.js

Tambien fue necesario corregir la app, para que utilizara los estilos

- \e-commerce-completo\01-frontend\mini-store\src\App.js

```js
import React from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "styled-components";
import Theme from "./styles";

function App() {
  return (
    <div>
      <ThemeProvider theme={Theme}>
        <GlobalStyles />
        <AppRouter />
      </ThemeProvider>
    </div>
  );
}

export default App;

```

#### index.js

Habia un pequeño error al importar el provider de la store

- \e-commerce-completo\01-frontend\mini-store\src\index.js

```js 
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

```

#### LoginForm

y había que mezclar el loginform con las funcionalidades anterirores:

- \e-commerce-completo\01-frontend\mini-store\src\components\LoginForm\index.js

```js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/slices/userSlice";
import { LoginFieldset, LoginFormContainer } from "./styles";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { ASYNC_STATUS } from "../../constants/asyncStatus";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const {
    emailValid,
    passwordValid,
    validateInput,
    handleValidation,
    handleRegister,
    handleGuest,
  } = useAuth();

 
  return (
    <LoginFormContainer>
      <LoginFieldset>
        <h2>Nice to see you again!</h2>
        <form onSubmit={handleValidation}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            required
            className={
              emailValid === null ? "" : emailValid ? "valid" : "invalid"
            }
            onBlur={validateInput}
          />
          <span
            className={emailValid === false ? "error-message" : "message-space"}
          >
            {emailValid === false && "Incorrect Email"}
          </span>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="text"
            name="password"
            placeholder="Password123"
            minLength={8}
            required
            className={
              passwordValid === null ? "" : passwordValid ? "valid" : "invalid"
            }
            onBlur={validateInput}
          />
          <span
            className={
              passwordValid === false ? "error-message" : "message-space"
            }
          >
            {passwordValid === false && "Incorrect Password"}
          </span>
          <button type="submit">Login</button>
        </form>
      </LoginFieldset>
      <p>Or......</p>
      <h2 className="notAcount">Don't you have an account?</h2>
      <button onClick={handleRegister}>Go to register!</button>
      <p>Or......</p>
      <button className="guest" onClick={handleGuest}>
        Continue as guest
      </button>
    </LoginFormContainer>
  );
};

export default LoginForm;

```

No olvidemos el archivo de estilos, del cual generamos una nueva etiqueta contenedora

- \e-commerce-completo\01-frontend\mini-store\src\components\LoginForm\styles.js

```js 
import styled from "styled-components";
import {
  flexColumn,
  buttonBase,
  darkModeText,
  buttonHover,
  flexCenter,
} from "../../styles/mixins";

const LoginFormContainer = styled.section`
  ${flexCenter}
  ${flexColumn}
  padding: 0px;
  margin: 0;
  width: 100%;
  button {
    width: 80%;
    margin-top: 10px;
    background-color: #28a745;
    border: 2px solid #28a745;
    padding: 12px 24px;
    color: white;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .guest {
    width: 80%;
    margin-top: 10px;
    background-color: rgb(167, 51, 40);
    border: 2px solid rgb(167, 51, 40);
    padding: 12px 24px;
    color: #fff;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  @media (hover: hover) {
    button:hover {
      background-color: transparent;
      color: #28a745;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
    }

    .guest:hover {
      background-color: transparent;
      color: rgb(167, 51, 40);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(167, 51, 40, 0.3);
    }
  }

  @media (prefers-color-scheme: dark) {
    background-color: #919191;
    color: #fff;
    p {
      color: #fff;
    }

    .notAcount {
      color: #fff;
    }
    @media (hover: hover) {
      button:hover,
      .guest:hover {
        color: #fff;
      }
    }
  }
`;

const LoginFieldset = styled.fieldset`
  ${flexColumn}
  width: 90%;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  z-index: 2;
  box-shadow: 5px 5px 13px rgba(0, 0, 0, 0.5);
  h2 {
    width: 100%;
    color: #000;
    font-weight: bold;
    font-size: 1.5em;
    text-align: center;
    margin: 0;
    font-size: clamp(15px, 23px, 22px);
    text-wrap: nowrap;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    padding: 0px;

    label {
      font-weight: bold;
      margin-bottom: 5px;
      color: #000;
    }
    .error-message,
    .message-space {
      height: 20px;
      display: block;
      margin-top: 4px;
      font-size: 0.9rem;
    }

    .error-message {
      color: #f44336;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 2px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
      }
      &.valid {
        border: 2px solid #4caf50;
      }

      &.invalid {
        border: 2px solid #f44336;
      }
    }
  }
  button {
    ${buttonBase}
    background-color: #007bff;
    border: 2px solid #007bff;
    color: white;
    width: 100%;
    margin: 0;
  }

  ${darkModeText}
  @media (hover: hover) and (pointer: fine) {
    button:hover {
      ${buttonHover}
      color: #007bff;
      box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
    }
  }

  @media (prefers-color-scheme: dark) {
    h2,
    form label {
      color: #fff;
    }

    @media (hover: hover) and (pointer: fine) {
      button:hover {
        ${buttonHover}
        color: #fff;
        box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
      }
    }
  }

  @media (max-width: 768px) {
    margin-top: 50px;
  }
`;

export { LoginFieldset, LoginFormContainer };

```

## index.html

Noté que podríamos establecer diseños para que se respetara mejor el tamaño de pantalla

- \e-commerce-completo\01-frontend\mini-store\public\index.html

```html
<!DOCTYPE html>
<html lang="en" style="width: 100dvw;">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
   
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  
    <title>Mini Store</title>
  </head>
  <body style="margin: 0; width: 100%;">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  
  </body>
</html>

```

## RegisterPage

Descomentamos RegisterPage del router

- \e-commerce-completo\01-frontend\mini-store\src\router\AppRouter.js

```js 
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
// import HomePage from "../pages/HomePage";
// import CartPage from "../pages/CartPage";
// import CheckoutPage from "../pages/CheckoutPage";
// import PostCheckoutPage from "../pages/PostCheckoutPage";

const AppRouter = () => {
  return (
    <Router basename="/e-commerce-completo">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />
        {/*<Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/post-checkout" element={<PostCheckoutPage />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;

```

Y esta sería la base para el registerpage

- \e-commerce-completo\01-frontend\mini-store\src\pages\RegisterPage\index.js

```js
import React from "react";
import RegisterForm from "../../components/RegisterForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logoEcomm.jpg";
import {
  RegistryContent,
  RegistryImg,
  RegistryContainer,
  RegistryLogo,
  RegistryOptions,
} from "./styles.js";

const Registry = () => {
  return (
    <>
      <RegistryContainer>
        <RegistryOptions>
          <RegistryContent>
            <RegistryLogo>
              <img src={logo} alt="logo-ecommerce" />
              <span>Mini Store</span>
            </RegistryLogo>
            <RegisterForm />
          </RegistryContent>
          <RegistryImg />
        </RegistryOptions>
      </RegistryContainer>
    </>
  );
};

export default Registry;

```

Y el codigo del formulario de registro

- \e-commerce-completo\01-frontend\mini-store\src\components\RegisterForm\index.js

```js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../redux/slices/userSlice";
import { FormContaier, Form, Title, Label, Input, Button } from "./styled";
import { Link, useNavigate } from "react-router-dom";
import { ASYNC_STATUS } from "../../constants/asyncStatus";

const RegisterForm = () => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, SetConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match ");
      return;
    }

    dispatch(createUser({ email, user, password }));
    navigate("/");
  };

  return (
    <FormContaier>
      <Form onSubmit={handleSubmit}>
        <Title>Register</Title>
        <Label>User</Label>
        <Input
          placeholder="Tu nombre de Usuario"
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <Label>Email</Label>
        <Input
        placeholder="Añadetuemail@gmail.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Label>Password</Label>
        <Input
          placeholder="Escribe tu contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Label>Confirm Password</Label>
        <Input
          placeholder="Escribe tu contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => SetConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Register</Button>
        {status === ASYNC_STATUS.REJECTED && <p>Error: {error}</p>}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Form>
    </FormContaier>
  );
};

export default RegisterForm;

```

Con sus estilos claro

- \e-commerce-completo\01-frontend\mini-store\src\components\RegisterForm\styled.js

```js 
import styled from "styled-components";
import {
  flexCenter,
  flexColumn,
  buttonBase,
  buttonHover,
  darkModeText
} from "../../styles/mixins";

const FormContaier = styled.section`
  ${flexColumn}
  width: 90%;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  z-index: 2;
  box-shadow: 5px 5px 13px rgba(0, 0, 0, 0.5);

  p {
    font-weight: 400px;
  }
  ${darkModeText}
  @media (hover: hover) and (pointer: fine) {
    button:hover {
      ${buttonHover}
      color: #007bff;
      box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
    }
  }

  @media (prefers-color-scheme: dark) {
    h2,
    form label {
      color: #fff;
    }

    @media (hover: hover) and (pointer: fine) {
      button:hover {
        ${buttonHover}
        color: #fff;
        box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
      }
    }
  }

  @media (max-width: 768px) {
    margin-top: 50px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  padding: 0px;
`;

const Title = styled.h1`
  width: 100%;
  color: #000;
  font-weight: bold;
  font-size: 1.5em;
  text-align: left;
  margin: 0;
  font-size: clamp(15px, 23px, 22px);
  text-wrap: nowrap;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #000;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
`;

const Button = styled.button`
  ${buttonBase}
  ${buttonHover}
  background-color: #007bff;
  border: 2px solid #007bff;
  color: white;
  width: 100%;
  margin: 0;
`;

export { FormContaier, Form, Title, Label, Input, Button };

```
