import {
  Box,
  CircularProgress,
  Container,
  Divider,
  InputLabel,
  Link,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import SecurityIcon from "@material-ui/icons/Security";
import Image from "material-ui-image";
import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import LoadingButton from "src/components/LoadingButton";
import { UserContext } from "src/contexts/UserContext";
import useGetById from "src/hooks/useGetById";
import useGetCart from "src/hooks/useGetCart";
import useUpdateCart from "src/hooks/useUpdateCart";
import { IProduct } from "src/types";
import { convertText } from "src/utils/convertText";
import currencyFormatter from "src/utils/formatCurrency";

const useStyles = makeStyles((theme) => ({
  product: {
    display: "flex",
    margin: "20px 0",
    justifyContent: "center",
    "@media (max-width:768px)": {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  infoBox: {
    "@media (max-width:768px)": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  imageBox: {
    marginRight: "50px",
    "@media (max-width:768px)": {
      margin: 0,
    },
  },
  image: {
    width: "450px",
    height: "450px",
    "@media (max-width:768px)": {
      marginBottom: "20px",
      width: "320px",
      height: "320px",
    },
  },
  noImage: {
    width: "450px",
    height: "450px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    color: "black",
    "@media (max-width:768px)": {
      width: "320px",
      height: "320px",
    },
  },
  price: {
    display: "flex",
    alignItems: "center",
    marginLeft: "8px",
    justifyContent: "space-between",
    "@media (max-width:768px)": {
      marginTop: "20px",
      display: "block",
      textAlign: "center",
    },
  },
  highlight: {
    color: theme.palette.success.main,
  },
  description: {
    maxWidth: "80%",
    "@media (max-width:768px)": {
      textAlign: "center",
    },
  },
  divider: {
    width: "100%",
  },
  form: {
    width: "45%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: "20px",
    "@media (max-width:768px)": {
      width: "100%",
      marginLeft: "0",
    },
  },
  input: {
    marginTop: "5px",
    width: "95%",
    margin: "auto",
  },
}));

const IndividualProduct = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const { isSuccess, data, isLoading, isError } = useGetById<IProduct>("product", id);
  const classes = useStyles();
  const navigate = useNavigate();
  const cartQuery = useGetCart(user?.userInfo.id);
  const updateCart = useUpdateCart();
  const { enqueueSnackbar } = useSnackbar();
  const [quantity, setQuantity] = useState(1);

  const STOCK = 20;

  const handleAddItem = (productId: number, quantity: number) => {
    if (!user) {
      navigate("/login");
    } else {
      // If we have that item in the cart we sum the quantities..
      const cartItem = cartQuery.data?.cartItems.find((item) => item.productId === productId);
      if (cartItem) {
        const totalQuantity = quantity + cartItem.quantity;
        // and if the sum is higher than the stock we show an error
        if (totalQuantity > STOCK) {
          enqueueSnackbar("There is not enough quantity on stock for this purchase.", { variant: "error" });
          return;
        }
        updateCart.mutate({ productId, quantity: totalQuantity, userId: user!.userInfo.id, action: "add" });
      } else {
        updateCart.mutate({ productId, quantity, userId: user!.userInfo.id, action: "add" });
      }
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setQuantity(Number(event.target.value));
  };

  return (
    <Container>
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress color="secondary"></CircularProgress>
        </Box>
      ) : isError ? (
        <Typography>Whoops. Something went wrong.</Typography>
      ) : (
        isSuccess && (
          <Box my={5} mb={8}>
            <Typography variant="body2">
              Category {"> "}
              <Link color="secondary" component={RouterLink} to={"/products?category=" + data!.category.id}>
                {convertText(data!.category.name)}
              </Link>
            </Typography>
            <Box className={classes.product}>
              <Box className={classes.imageBox}>
                <Paper className={classes.image}>
                  {data?.image ? (
                    <Image
                      disableTransition
                      imageStyle={{ borderRadius: "4px" }}
                      style={{ borderRadius: "4px" }}
                      src={data!.image}
                    />
                  ) : (
                    <Paper className={classes.noImage}>
                      <Typography>Image not found.</Typography>
                    </Paper>
                  )}
                </Paper>
              </Box>
              <Box className={classes.infoBox} flexGrow={1}>
                <Box mb={2}>
                  <Typography align="center" variant="h4">
                    {data?.name}
                  </Typography>
                </Box>
                <Divider className={classes.divider}></Divider>
                <Box my={2} className={classes.description}>
                  <Typography variant="h6">Description</Typography>
                  <Typography variant="subtitle1">{data?.description}</Typography>
                </Box>
                <Divider className={classes.divider}></Divider>
                <Box my={2}>
                  <Box display="flex" alignItems="center">
                    <LocalShippingIcon className={classes.highlight} fontSize="small" />
                    <Box ml={1}>
                      <Typography className={classes.highlight}>Free shipping</Typography>
                    </Box>
                  </Box>
                  {data?.stock ? (
                    <Box display="flex" alignItems="center">
                      <CheckCircleIcon className={classes.highlight} fontSize="small" />
                      <Box ml={1}>
                        <Typography className={classes.highlight}>In stock</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center">
                      <HighlightOffIcon color="error" fontSize="small" />
                      <Box ml={1}>
                        <Typography color="error">Out of stock</Typography>
                      </Box>
                    </Box>
                  )}
                  <Box display="flex" alignItems="center">
                    <SecurityIcon className={classes.highlight} fontSize="small" />
                    <Box ml={1}>
                      <Typography className={classes.highlight}>Warranty - 12 months</Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider className={classes.divider}></Divider>
                <Box className={classes.price}>
                  <Box>
                    <Typography variant="h4" color="textPrimary">
                      {currencyFormatter.format(data!.price)}
                    </Typography>
                  </Box>
                  <Box className={classes.form}>
                    <FormControl className={classes.input}>
                      <InputLabel>Quantity</InputLabel>
                      <Select label="Quantity" value={quantity} onChange={handleQuantityChange}>
                        {[...Array(STOCK)].map((e, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography variant="caption" color="textSecondary">
                        {STOCK} available in stock.
                      </Typography>
                    </FormControl>
                    <Box>
                      {updateCart.isLoading ? (
                        <LoadingButton size="large" isSubmitting name="Adding to cart..." />
                      ) : (
                        <LoadingButton
                          size="large"
                          onClick={() => handleAddItem(Number(data!.id), quantity)}
                          name="Add to cart"
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )
      )}
    </Container>
  );
};

export default IndividualProduct;
