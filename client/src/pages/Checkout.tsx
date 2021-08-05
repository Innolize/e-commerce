import { Box, Button, Link, Paper, Step, StepLabel, Stepper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import PaymentForm from "src/components/PaymentForm";
import Review from "src/components/Review";
import useCreate from "src/hooks/useCreate";
import useGetCart from "src/hooks/useGetCart";
import { IOrder, PAYMENT_TYPE } from "src/types";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ["Payment details", "Review your order"];

const getStepContent = (
  step: number,
  handlePaymentChange: (payment: typeof PAYMENT_TYPE[number]) => void,
  payment: typeof PAYMENT_TYPE[number]
) => {
  switch (step) {
    case 0:
      return <PaymentForm paymentProp={payment} handlePaymentChange={handlePaymentChange} />;
    case 1:
      return <Review payment={payment} />;
    default:
      throw new Error("Unknown step");
  }
};

const Checkout = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const cartQuery = useGetCart();
  const [payment, setPayment] = useState<typeof PAYMENT_TYPE[number]>(PAYMENT_TYPE[0]);
  const createOrder = useCreate<IOrder>("order");
  const queryClient = useQueryClient();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePaymentChange = (payment: typeof PAYMENT_TYPE[number]) => {
    setPayment(payment);
  };

  const handlePlaceOrder = () => {
    handleNext();
    const formData = new FormData();
    formData.append("paymentType", payment);
    createOrder.mutate(formData, {
      onSuccess: () => queryClient.invalidateQueries("cart"),
    });
  };

  return (
    <Box className={classes.layout}>
      <Paper className={classes.paper}>
        <Typography paragraph component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {activeStep === steps.length ? (
            createOrder.isSuccess && (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order was created. Order id {createOrder.data?.id}. You can view your all orders{" "}
                  <Link underline="always" color="secondary" component={RouterLink} to="/orders">
                    here.
                  </Link>
                </Typography>
              </React.Fragment>
            )
          ) : (
            <React.Fragment>
              {getStepContent(activeStep, handlePaymentChange, payment)}
              <div className={classes.buttons}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} className={classes.button}>
                    Back
                  </Button>
                )}
                {activeStep === steps.length - 1 ? (
                  <Button
                    disabled={!cartQuery.data?.cartItems.length}
                    variant="contained"
                    color="primary"
                    onClick={handlePlaceOrder}
                    className={classes.button}
                  >
                    Place order
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                    Next
                  </Button>
                )}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      </Paper>
    </Box>
  );
};

export default Checkout;
