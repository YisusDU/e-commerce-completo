import React, { useState } from "react";
import InputMask from "react-input-mask";
import { Label, Input, Button } from "./styled";

const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  nextStep,
  prevStep,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePaymentSave = (e) => {
    e.preventDefault();
    setPaymentMethod(
      `Card ending in ${cardNumber.slice(-4)}, Expiry: ${expiryDate}`
    );
    nextStep();
  };

  return (
    <form onSubmit={handlePaymentSave}>
      <Label>Card Number</Label>
      <Input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Add your card number (debit/credit)"
        maxLength={20}
        inputMode="number"
        required
      />
      <Label>Expiry Date</Label>
      <InputMask
        className="mask"
        mask="99/99"
        type="text"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        placeholder="Add your card expiry date "
        required
      />
      <Label>CVV</Label>
      <Input
        type="text"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
        placeholder="Add your card CVV"
        maxLength={4}
        inputMode="number"
        required
      />
      <Button type="button" onClick={prevStep} className="back">
        Back
      </Button>
      <Button type="submit">Next</Button>
    </form>
  );
};

export default PaymentStep;
