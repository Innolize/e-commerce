import { MenuItem, TextField, Typography } from "@material-ui/core";
import React from "react";
import { PAYMENT_TYPE } from "src/types";

interface Props {
  handlePaymentChange: (payment: typeof PAYMENT_TYPE[number]) => void;
  paymentProp: typeof PAYMENT_TYPE[number];
}

const PaymentForm = ({ handlePaymentChange, paymentProp }: Props) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <TextField
        onChange={(e) => handlePaymentChange(e.target.value)}
        type="text"
        margin="normal"
        variant="outlined"
        select
        fullWidth
        required
        value={paymentProp}
        defaultValue={paymentProp}
      >
        {PAYMENT_TYPE.map((payment) => (
          <MenuItem key={payment} value={payment}>
            {payment}
          </MenuItem>
        ))}
      </TextField>
    </React.Fragment>
  );
};

export default PaymentForm;
