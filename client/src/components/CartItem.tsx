import { Box, CircularProgress, Divider, Grid, Link, makeStyles, Paper, Typography } from "@material-ui/core";
import Image from "material-ui-image";
import { useEffect, useState } from "react";
import { useIsMutating } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { ICartItem } from "src/types";
import { convertText } from "src/utils/convertText";
import currencyFormatter from "src/utils/formatCurrency";
import QuantityControlls from "./QuantityControlls";

interface Props {
  cartItems: ICartItem[] | [];
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
}

const CartItem = ({ cartItems, removeItem, updateQuantity }: Props) => {
  const classes = useStyles();
  const isMutating = useIsMutating({ mutationKey: "updating_cart" });
  const sortedItems = cartItems.sort((a, b) => a.product.name.localeCompare(b.product.name));
  const [loading, setLoading] = useState(new Array(sortedItems.length).fill(false));

  useEffect(() => {
    if (!isMutating) {
      setLoading(new Array(sortedItems.length).fill(false));
    }
  }, [isMutating, sortedItems.length]);

  const handleUpdateQuantity = (productId: number, quantity: number, index: number) => {
    updateQuantity(productId, quantity);
    setLoading((prev) => {
      const newArr = [...prev];
      newArr[index] = !newArr[index];
      return newArr;
    });
  };

  if (!cartItems.length) {
    return (
      <Box display="flex" justifyContent="center" my={6}>
        <Typography variant="h6">No items in the cart</Typography>
      </Box>
    );
  } else {
    return (
      <>
        {sortedItems.map((item: ICartItem, index) => (
          <Box className={classes.cart} key={item.id}>
            <Grid alignItems="center" justify="center" className={classes.itemGrid} container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <Box className={classes.imageName}>
                  <Paper elevation={1} className={classes.image}>
                    {item.product.image ? (
                      <Image
                        style={{
                          borderRadius: "4px",
                          height: "80px",
                        }}
                        imageStyle={{ borderRadius: "4px", height: "80px" }}
                        src={item.product.image}
                      />
                    ) : (
                      <Box className={classes.noImage}>
                        <Typography>Image not found.</Typography>
                      </Box>
                    )}
                  </Paper>
                  <Link color="textPrimary" underline="none" component={RouterLink} to={"products/" + item.productId}>
                    <Typography variant="h5">{item.product.name}</Typography>
                  </Link>
                </Box>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Link
                    color="secondary"
                    variant="body2"
                    component={RouterLink}
                    to={"/products?category=" + item.product.category.id}
                  >
                    See more {convertText(item.product.category.name)}
                  </Link>
                  <Box ml={6}>
                    <Link
                      color="secondary"
                      variant="body2"
                      component="button"
                      onClick={() => {
                        removeItem(item.id);
                        setLoading((prev) => {
                          const newArr = [...prev];
                          newArr[index] = !newArr[index];
                          return newArr;
                        });
                      }}
                    >
                      Remove item
                    </Link>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3} md={3}>
                {loading[index] ? (
                  <CircularProgress />
                ) : (
                  <QuantityControlls item={item} handleUpdateQuantity={handleUpdateQuantity} index={index} />
                )}
              </Grid>
              <Grid item xs={12} sm={3} md={3}>
                <Box>
                  <Typography style={{ wordWrap: "break-word" }} variant="h5">
                    {currencyFormatter.format(item.product.price * item.quantity)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider variant="middle" />
          </Box>
        ))}
      </>
    );
  }
};

export default CartItem;

const useStyles = makeStyles({
  cart: {
    padding: "0px 10px",
    position: "relative",
    "@media(max-width: 600px)": {
      padding: "0px",
    },
  },
  itemGrid: {
    textAlign: "center",
    margin: "20px 0",
    maxWidth: "100%",
  },
  image: {
    minWidth: "80px",
    width: "80px",
    height: "80px",
    marginRight: "10px",
  },
  noImage: {
    minWidth: "80px",
    height: "80px",
    display: "flex",
    borderRadius: "4px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    color: "black",
  },
  imageName: {
    display: "flex",
    alignItems: "center",
    "@media(max-width: 600px)": {
      padding: "20px 10px",
    },
  },
  quantity: {
    display: "flex",
    justifyContent: "center",
    "@media(max-width: 600px)": {
      display: "flex",
    },
  },
  removeBtn: {
    "@media(max-width: 600px)": {
      top: 0,
      right: -15,
      position: "absolute",
    },
  },
  input: {
    width: "70px",
    textAlign: "center",
  },
});
