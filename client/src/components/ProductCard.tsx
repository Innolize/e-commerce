/* eslint-disable no-useless-computed-key */
import { Card, CardActionArea, CardContent, CardMedia, Grid, makeStyles, Typography } from "@material-ui/core";
import noLogoFound from "src/images/no-logo.png";
import { IProduct } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import useScreenSize from "use-screen-size";

const useStyles = makeStyles({
  cardContainer: {
    ["@media(max-width: 768px)"]: {
      width: "100%",
      margin: "3px 0",
    },
  },
  card: {
    ["@media(max-width: 768px)"]: {
      display: "flex",
      justifyContent: "space-between",
    },
  },
  media: {
    height: 140,
    ["@media(max-width: 768px)"]: {
      width: "30%",
    },
  },
  content: {
    width: "70%",
  },
});

interface Props {
  products: IProduct[];
}

const ProductCard = ({ products }: Props) => {
  const screenSize = useScreenSize();
  const classes = useStyles();

  if (screenSize.width <= 768) {
    return (
      <>
        {products.map((product: IProduct) => (
          <Card key={product.id} className={classes.cardContainer}>
            <CardActionArea className={classes.card}>
              <CardMedia className={classes.media} image={product.image || noLogoFound} />
              <CardContent className={classes.content}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {currencyFormatter.format(product.price)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </>
    );
  } else {
    return (
      <Grid container spacing={2}>
        {products.map((product: IProduct) => (
          <Grid key={product.id} item xs={4}>
            <Card className={classes.cardContainer}>
              <CardActionArea className={classes.card}>
                <CardMedia className={classes.media} image={product.image || noLogoFound} />
                <CardContent className={classes.content}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {currencyFormatter.format(product.price)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
};

export default ProductCard;
