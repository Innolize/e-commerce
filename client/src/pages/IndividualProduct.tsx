import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Link,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import Image from "material-ui-image";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import useGetById from "src/hooks/useGetById";
import { IProduct } from "src/types";
import { convertText } from "src/utils/convertText";
import currencyFormatter from "src/utils/formatCurrency";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import SecurityIcon from "@material-ui/icons/Security";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

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
    marginLeft: "8px",
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
}));

const IndividualProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { isSuccess, data, isLoading, isError } = useGetById<IProduct>("product", id);
  const classes = useStyles();

  return (
    <Container>
      {isLoading ? (
        <Box mt={3}>
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
                <Box display="flex" alignItems="center" my={4}>
                  <Typography className={classes.price} variant="h4" color="textPrimary">
                    {currencyFormatter.format(data!.price)}
                  </Typography>
                  <Box ml={3}>
                    <Button startIcon={<AddShoppingCartIcon />} variant="contained" size="large" color="secondary">
                      Add to cart
                    </Button>
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
