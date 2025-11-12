import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAddresses, addAddress } from "../../redux/slices/addressSlice";
import { AddressContainer, Label, Input, Button, Navigation } from "./styled";
import { ASYNC_STATUS } from "../../constants/asyncStatus";

// Estado inicial para el formulario de nueva dirección
const initialFormState = {
  name: "",
  address_line_1: "",
  city: "",
  state: "",
  postal_code: "",
  nickname: "", // Opcional
};

const ShippingStep = ({ nextStep, prevStep, setSelectedAddress }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Conéctate al 'addressSlice' de Redux
  const {
    list: addresses,
    status,
    error,
  } = useSelector((state) => state.address);

  //  Estado local para manejar el componente
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  // Carga las direcciones existentes cuando el componente se monta
  useEffect(() => {
    // Solo llama a la API si la lista no se ha cargado
    if (status === ASYNC_STATUS.IDLE) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, status]);

  // Manejador para los campos del formulario de nueva dirección
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lógica para el botón "Siguiente"
  const handleNext = async () => {
    //  El usuario está creando una nueva dirección ----
    if (showNewForm) {
      try {
        // Llama al thunk 'addAddress' y espera la respuesta
        const newAddress = await dispatch(addAddress(formData)).unwrap();

        // 'newAddress' es la nueva dirección (ej. { id: 5, ... })
        setSelectedAddress(newAddress);
        nextStep(); // Avanza al pago
      } catch (validationError) {
        // 'validationError' son los errores del serializer de Django
        console.error("Failed to save address:", validationError);
        alert("Failed to save address. Please check all required fields.");
      }
    }
    // El usuario seleccionó una dirección existente ----
    else if (selectedAddressId) {
      // Búscalo en la lista que ya tenemos
      const addressObject = addresses.find((a) => a.id === selectedAddressId);

      //  ¡EL CAMBIO! Pasa el objeto completo
      setSelectedAddress(addressObject);
      nextStep();
    }
    //  No se hizo nada ----
    else {
      alert("Please select or create a shipping address.");
    }
  };

  //  Renderizado del componente
  return (
    <AddressContainer>
      <h3>Shipping Address</h3>

      {status === "pending" && <p>Loading addresses...</p>}
      {status === "failed" && error && (
        <p style={{ color: "red" }}>
          Error: {error.detail || "Could not load addresses."}
        </p>
      )}

      {/*  LISTA DE DIRECCIONES (si no estamos en modo "crear") === */}
      {!showNewForm &&
        addresses.length > 0 &&
        addresses.map((address) => (
          <div key={address.id}>
            <Label className="address">
              <Input
                type="radio"
                name="shippingAddress"
                value={address.id}
                onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                checked={selectedAddressId === address.id}
                className="radio"
              />
              <div>
                <strong>{address.nickname || address.name}</strong>
                <p>
                  {address.address_line_1}, {address.city}, {address.state}, 
                   CP {address.postal_code}
                </p>
              </div>
            </Label>
          </div>
        ))}

      {/* Mensaje si no hay direcciones y no estamos creando una */}
      {!showNewForm && addresses.length === 0 && status === "fulfilled" && (
        <p>You have no saved addresses. Please add one.</p>
      )}

      {/* BOTÓN PARA MOSTRAR/OCULTAR EL FORMULARIO === */}
      <Button
        type="button"
        onClick={() => {
          setShowNewForm(!showNewForm);
          setSelectedAddressId(null); // Limpia la selección de radio
        }}
        style={{ margin: "10px 0" }}
        className="fit" 
      >
        {showNewForm ? "Cancel and use existing" : " ➕ Add a new address"}
      </Button>

      {/*  FORMULARIO DE NUEVA DIRECCIÓN (si showNewForm es true) === */}
      {showNewForm && (
        <form>
          <Label>Full Name</Label>
          <Input
            name="name"
            placeholder="Full name for delivery"
            onChange={handleChange}
          />

          <Label>Address Line 1</Label>
          <Input
            name="address_line_1"
            placeholder="Street address, apartment, etc."
            onChange={handleChange}
            required
          />

          <Label>City</Label>
          <Input
            name="city"
            placeholder="City"
            onChange={handleChange}
            required
          />

          <Label>State / Province</Label>
          <Input
            name="state"
            placeholder="State"
            onChange={handleChange}
            required
          />

          <Label>Postal Code</Label>
          <Input
            name="postal_code"
            placeholder="Postal Code"
            onChange={handleChange}
            required
          />

          <Label>Nickname (Optional)</Label>
          <Input
            name="nickname"
            placeholder="e.g., Home, Work"
            onChange={handleChange}
          />
        </form>
      )}

      {/*  BOTONES DE NAVEGACIÓN === */}
      <Navigation>
        <Button
          type="button"
          onClick={() => {
            navigate("/");
          }}
          className="back"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={status === ASYNC_STATUS.PENDING}
        >
          {status === ASYNC_STATUS.PENDING ? "Loading..." : "Next"}
        </Button>
      </Navigation>
    </AddressContainer>
  );
};

export default ShippingStep;
