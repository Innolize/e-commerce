import { Box, Divider, List, ListItem, ListItemText, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import useGetCart from "src/hooks/useGetCart";
import { ICartItem, PAYMENT_TYPE } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1.1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

interface Props {
  payment: typeof PAYMENT_TYPE[number];
}

const Review = ({ payment }: Props) => {
  const classes = useStyles();
  const cartQuery = useGetCart();

  const getTotalPrice = (cartItems: ICartItem[]): string => {
    return currencyFormatter.format(
      cartItems.reduce((totalPrice, item) => totalPrice + item.product.price * item.quantity, 0)
    );
  };

  if (!cartQuery.data) {
    return (
      <Box my={3}>
        <Typography align="center" variant="h6" gutterBottom>
          We could not get the cart data.
        </Typography>
      </Box>
    );
  }

  if (!cartQuery.data.cartItems.length) {
    return (
      <Box my={3}>
        <Typography align="center" variant="h6" gutterBottom>
          You don't have items in the cart.
        </Typography>
      </Box>
    );
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {cartQuery.data.cartItems.map((item: ICartItem) => (
          <Box my={2} key={item.id}>
            <ListItem className={classes.listItem} key={item.id}>
              <ListItemText
                primary={item.product.name}
                secondary={currencyFormatter.format(item.product.price) + " x " + item.quantity}
              />
              <Box mt={2}>
                <Typography variant="body2">
                  Subtotal: {currencyFormatter.format(item.quantity * item.product.price)}
                </Typography>
              </Box>
            </ListItem>
            <Divider></Divider>
          </Box>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            {getTotalPrice(cartQuery.data.cartItems)}
          </Typography>
        </ListItem>
      </List>
      <Typography variant="h6" gutterBottom className={classes.title}>
        Payment details
      </Typography>
      <Typography gutterBottom>Method: {payment}</Typography>
    </React.Fragment>
  );
};

export default Review;
