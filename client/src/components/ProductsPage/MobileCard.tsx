/* eslint-disable no-useless-computed-key */
import { Card, CardActionArea, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import noLogoFound from "src/images/no-logo.png";
import { IProduct } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";

const useStyles = makeStyles({
  cardContainer: {
    height: "auto",
    width: "100%",
    margin: "3px 0",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
  },
  media: {
    height: 150,
    width: "50%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  price: {
    marginBottom: "10px",
  },
});

interface Props {
  products: IProduct[];
}

const MobileCard = ({ products }: Props) => {
  const classes = useStyles();

  return (
    <>
      {products.map((product: IProduct) => (
        <Link key={product.id} to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
          <Card className={classes.cardContainer}>
            <CardActionArea className={classes.card}>
              <CardMedia className={classes.media} image={product.image || noLogoFound} />
              <CardContent className={classes.content}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography className={classes.price} variant="body2" color="textSecondary" component="p">
                  {currencyFormatter.format(product.price)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      ))}
    </>
  );
};

export default MobileCard;
