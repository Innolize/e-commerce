import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { useContext } from "react";
import { UserContext } from "src/contexts/UserContext";
import { Redirect } from "react-router-dom";
import CartItem from "src/components/CartItem";
import useUpdateCart from "src/hooks/useUpdateCart";
import useGetCart from "src/hooks/useGetCart";
import useRemoveCartItem from "src/hooks/useRemoveCartItem";
import currencyFormatter from "src/utils/formatCurrency";

const useStyles = makeStyles({
  box: {
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  titlesContainer: {
    "@media(max-width: 600px)": {
      display: "none",
    },
  },
  titlesGrid: {
    textAlign: "center",
    margin: "10px 0",
  },
  total: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "25px 40px",
    "@media(max-width: 768px)": {
      display: "block",
      padding: "0",
      marginRight: "0",
    },
  },
  checkout: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
    "@media(max-width: 768px)": {
      justifyContent: "center",
      padding: "0",
      marginTop: "15px",
    },
  },
  checkoutBtn: {
    fontSize: "1.2rem",
    padding: "15px 25px",
    lineHeight: 1.5,
  },
});

const Cart = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const cartQuery = useGetCart(user?.userInfo.id);
  const removeCartItem = useRemoveCartItem();
  const updateCart = useUpdateCart();

  if (!user) {
    return <Redirect to="/login" />;
  }

  const updateQuantity = (productId: number, quantity: number) => {
    updateCart.mutate({ productId, quantity, userId: user.userInfo.id, action: "update" });
  };

  const removeItem = (productId: number) => {
    removeCartItem.mutate({ productId, userId: user.userInfo.id });
  };

  return (
    <Container>
      <Box my={5}>
        <Typography align="center" variant="h4">
          My shopping cart
        </Typography>
      </Box>
      {cartQuery.isSuccess ? (
        <Box my={7}>
          <Paper variant="outlined" square>
            <Box className={classes.titlesContainer} paddingTop={2}>
              <Grid justify="center" alignItems="center" className={classes.titlesGrid} container spacing={1}>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography>Description</Typography>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <Typography>Quantity</Typography>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <Typography>Price</Typography>
                </Grid>
              </Grid>
              <Divider variant="middle" />
            </Box>
            <CartItem cartItems={cartQuery.data.cartItems} removeItem={removeItem} updateQuantity={updateQuantity} />
            <Box className={classes.total}>
              <Paper variant="outlined" square className={classes.box}>
                <Typography variant="h5">
                  {`Total: ` +
                    currencyFormatter.format(
                      (cartQuery.data.cartItems as any[]).reduce(
                        (totalPrice, item) => totalPrice + item.product.price * item.quantity,
                        0
                      )
                    )}
                </Typography>
              </Paper>
            </Box>
          </Paper>
          <Box className={classes.checkout}>
            <Button color="secondary" className={classes.checkoutBtn} size="large" variant="contained">
              Checkout
            </Button>
          </Box>
        </Box>
      ) : cartQuery.isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        cartQuery.isError && (
          <Box>
            <Typography variant="h5" color="error">
              Whoops. We couldn't load the cart.
            </Typography>
          </Box>
        )
      )}
    </Container>
  );
};

export default Cart;
