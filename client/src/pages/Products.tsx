import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "src/types";
import { Box, Button } from "@material-ui/core";
import useGetAll from "src/hooks/useGetAll";
import { IGetProducts } from "src/hooks/types";

const useStyles = makeStyles({
  cardContainer: {
    width: "95%",
    margin: "3px 0",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
  },
  media: {
    height: 140,
    width: "30%",
  },
  content: {
    width: "70%",
  },
});

const Products = () => {
  const classes = useStyles();
  const queryProducts = useGetAll<IGetProducts>("product");

  return (
    <Box alignItems="center" my={2} display="flex" flexDirection="column">
      <Box my={2} display="flex" alignItems="center">
        {queryProducts.isSuccess && (
          <Typography variant="subtitle1">
            Mostrando {queryProducts.data.count} productos.
          </Typography>
        )}
        <Button variant="text">Filtrar</Button>
      </Box>
      {queryProducts.isSuccess &&
        queryProducts.data.results.map((product: IProduct) => (
          <Card elevation={0} key={uuidv4()} className={classes.cardContainer}>
            <CardActionArea className={classes.card}>
              <CardMedia className={classes.media} image={product.image} />
              <CardContent className={classes.content}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  $ {product.price}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
    </Box>
  );
};

export default Products;
