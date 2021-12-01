import {
  Box,
  Button,
  CircularProgress,
  Container,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import DesktopCard from "src/components/ProductsPage/DesktopCard";
import MobileCard from "src/components/ProductsPage/MobileCard";
import useGetProducts from "src/hooks/useGetProducts";
import useScreenSize from "use-screen-size";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    slider: {
      width: "90%",
      maxWidth: "90%",
      minHeight: "150px",
      "@media(max-width: 768px)": {
        width: "80%",
        maxWidth: "80%",
      },
    },
    image: {
      objectFit: "fill",
      width: "100%",
      minHeight: "150px",
    },
    container: {
      outline: "none",
    },
    prevArrow: {
      fontSize: "0",
      lineHeight: "0",
      position: "absolute",
      top: "50%",
      display: "block",
      width: "30px",
      height: "30px",
      padding: "0",
      transform: "translate(0, -50%)",
      cursor: "pointer",
      border: "none",
      outline: "none",
      background: "transparent",
      left: "-35px",
      "&::before": {
        content: '"←"',
        color: theme.palette.secondary.main,
        fontFamily: "slick",
        fontSize: "30px",
        lineHeight: "1",
        opacity: ".75",
      },
      "@media(max-width: 768px)": {
        width: "20px",
        height: "20px",
        left: "-25px",
        "&::before": {
          fontSize: "20px",
        },
      },
    },
    nextArrow: {
      fontSize: "0",
      lineHeight: "0",
      position: "absolute",
      top: "50%",
      display: "block",
      width: "30px",
      height: "30px",
      padding: "0",
      transform: "translate(0, -50%)",
      cursor: "pointer",
      border: "none",
      outline: "none",
      background: "transparent",
      right: "-35px",
      "&::before": {
        content: '"→"',
        color: theme.palette.secondary.main,
        fontFamily: "slick",
        fontSize: "30px",
        lineHeight: "1",
        opacity: ".75",
      },
      "@media(max-width: 768px)": {
        width: "20px",
        height: "20px",
        right: "-25px",
        "&::before": {
          fontSize: "20px",
        },
      },
    },
  })
);

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function SampleNextArrow(props: ArrowProps) {
  const classes = useStyles();
  const { onClick } = props;
  return <div className={classes.nextArrow} onClick={onClick} />;
}

function SamplePrevArrow(props: ArrowProps) {
  const classes = useStyles();
  const { onClick } = props;
  return <div className={classes.prevArrow} onClick={onClick} />;
}

const Home = () => {
  const classes = useStyles();

  const screenSize = useScreenSize();
  const queryProducts = useGetProducts(null, null, null, 3, "offers");

  const settings: Settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    infinite: true,
    speed: 500,
    focusOnSelect: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" my={8}>
        <Slider className={classes.slider} {...settings}>
          <div className={classes.container}>
            <img className={classes.image} src="images/carousel-1.jpg" alt="carousel"></img>
          </div>
          <div className={classes.container}>
            <img className={classes.image} src="images/carousel-2.jpg" alt="carousel"></img>
          </div>
          <div className={classes.container}>
            <img className={classes.image} src="images/carousel-3.jpg" alt="carousel"></img>
          </div>
          <div className={classes.container}>
            <img className={classes.image} src="images/carousel-4.jpg" alt="carousel"></img>
          </div>
          <div className={classes.container}>
            <img className={classes.image} src="images/carousel-5.jpg" alt="carousel"></img>
          </div>
          <div className={classes.container}>
            <img className={classes.image} src="images/carousel-6.jpg" alt="carousel"></img>
          </div>
        </Slider>
      </Box>
      <Box my={4}>
        <Typography align="center" variant="h3">
          Promotions and Discounts
        </Typography>
        {queryProducts.isSuccess ? (
          screenSize.width < 768 ? (
            <Box mb={4} mt={3}>
              <MobileCard products={queryProducts.data.results} />
            </Box>
          ) : (
            <Box mb={4} mt={3} mx={9}>
              <DesktopCard products={queryProducts.data.results}></DesktopCard>
            </Box>
          )
        ) : queryProducts.isLoading ? (
          <CircularProgress></CircularProgress>
        ) : (
          queryProducts.isError && (
            <Box my={2}>
              <Typography align="center" color="error">
                Error loading the products.
              </Typography>
            </Box>
          )
        )}
        <Box mb={6} display="flex" justifyContent="center">
          <Button color="secondary" variant="contained" to="/products" component={Link}>
            See more products...
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
