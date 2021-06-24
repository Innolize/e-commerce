import { Card, CardActionArea, CardContent, CardMedia, Grid, makeStyles, Typography } from "@material-ui/core";
import noLogoFound from "src/images/no-logo.png";
import { IProduct } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";

const useStyles = makeStyles({
  cardContainer: {
    height: "280px",
  },
  card: {
    height: "280px",
  },
  media: {
    height: 150,
  },
  content: {
    height: 135,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "10px",
  },
  price: {
    marginBottom: "10px",
  },
});

interface Props {
  products: IProduct[];
}

const DesktopCard = ({ products }: Props) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      {products.map((product: IProduct) => (
        <Grid key={product.id} item xs={4}>
          <Card className={classes.cardContainer}>
            <CardActionArea className={classes.card}>
              <CardMedia className={classes.media} image={product.image || noLogoFound} />
              <CardContent className={classes.content}>
                <Typography align="center" gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography align="center" variant="subtitle1" color="textSecondary" component="p">
                  {currencyFormatter.format(product.price)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DesktopCard;
