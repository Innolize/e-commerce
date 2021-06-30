import { Box, CircularProgress, Container, makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Filters from "src/components/ProductsPage/Filters";
import ProductsContainer from "src/components/ProductsPage/ProductsContainer";
import { IGetCategories } from "src/hooks/types";
import useGetAll from "src/hooks/useGetAll";
import useGetProducts from "src/hooks/useGetProducts";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const useStyles = makeStyles({
  box: {
    diplay: "flex",
    // eslint-disable-next-line no-useless-computed-key
    ["@media(max-width: 768px)"]: {
      display: "block",
    },
  },
});

const Products = () => {
  const LIMIT = 12;
  const classes = useStyles();
  const queryParam = useQuery();
  const history = useHistory();
  const queryProducts = useGetProducts(
    queryParam.get("offset"),
    queryParam.get("category"),
    queryParam.get("name"),
    LIMIT
  );
  const queryCategories = useGetAll<IGetCategories>("category");
  const [page, setPage] = useState(1);
  const offsetParam = queryParam.get("offset");

  useEffect(() => {
    if (!offsetParam) {
      setPage(1);
    }
  }, [offsetParam]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0 });
    setPage(value);
    const offset = (value - 1) * LIMIT;
    queryParam.set("offset", offset.toString());
    history.push("/products?" + queryParam.toString());
  };

  return (
    <Container>
      <Box className={classes.box} minHeight="70vh" display="flex" my={5}>
        {queryCategories.isSuccess && <Filters categories={queryCategories.data.results} />}

        <Box display="flex" justifyContent="space-between" flexDirection="column" flexGrow="1">
          {queryProducts.isSuccess ? (
            <ProductsContainer
              page={page}
              handlePageChange={handlePageChange}
              LIMIT={LIMIT}
              productData={queryProducts.data}
            />
          ) : queryProducts.isLoading ? (
            <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
              <Typography variant="h6" color="textSecondary">
                Loading products...
              </Typography>
              <Box mt={3}>
                <CircularProgress color="secondary"></CircularProgress>
              </Box>
            </Box>
          ) : (
            queryProducts.isError && (
              <Box display="flex" justifyContent="center" mt={10}>
                <Typography variant="h6" color="textSecondary">
                  Whoops. We couldn't load the products.
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Products;
