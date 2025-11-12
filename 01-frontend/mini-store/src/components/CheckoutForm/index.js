import React, { useState } from "react";
import ShippingStep from "./ShippingStep";
import PaymentStep from "./PaymentStep";
import ConfirmationStep from "./ConfirmationStep";
import ProgressBar from "./ProgressBar";
import { FormContainer } from "./styled";

const CheckoutForm = () => {
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  return (
    <FormContainer>
      <ProgressBar step={step} />
      {step === 1 && (
        <ShippingStep
          setSelectedAddress={setSelectedAddress}
          nextStep={nextStep}
        />
      )}
      {step === 2 && (
        <PaymentStep
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          prevStep={prevStep}
          nextStep={nextStep}
        />
      )}
      {step === 3 && (
        <ConfirmationStep
          selectedAddress={selectedAddress}
          paymentMethod={paymentMethod}
          prevStep={prevStep}
        />
      )}
    </FormContainer>
  );
};

export default CheckoutForm;
