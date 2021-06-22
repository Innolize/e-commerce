import { Box, CircularProgress, Container } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Pagination } from "@material-ui/lab";
import { useState } from "react";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import ProductCard from "src/components/ProductCard";
import { IGetCategories } from "src/hooks/types";
import useGetAll from "src/hooks/useGetAll";
import useGetProducts from "src/hooks/useGetProducts";
import { ICategory } from "src/types";
import useScreenSize from "use-screen-size";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const LIMIT = 12;

const Products = () => {
  const queryParam = useQuery();
  const [offset, setOffset] = useState(0);
  const queryProducts = useGetProducts(
    offset,
    queryParam.get("category") || undefined,
    queryParam.get("name") || undefined,
    LIMIT
  );
  const queryCategories = useGetAll<IGetCategories>("category");
  const screenSize = useScreenSize();
  const [page, setPage] = useState(1);
  const history = useHistory();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * LIMIT);
  };

  const handleCategoryChange = (id: number | string) => {
    setPage(1);
    setOffset(0);
    queryParam.set("category", id.toString());
    history.replace("/products/?" + queryParam.toString());
  };

  return (
    <Container>
      <Box display="flex" my={5}>
        {queryCategories.isSuccess && screenSize.width > 768 && (
          <Box minWidth="20%" display="flex" flexDirection="column" mt={4}>
            <Typography variant="h5">Categories</Typography>
            <Box display="flex" flexDirection="column" alignItems="flex-start" mt={1}>
              <Link color="textSecondary" to="/products" component={RouterLink}>
                Show all products
              </Link>
              {queryCategories.data.results.map((category: ICategory) => (
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => handleCategoryChange(category.id)}
                  key={category.id}
                  color="textSecondary"
                >
                  {category.name}
                </Link>
              ))}
            </Box>
          </Box>
        )}

        <Box display="flex" flexDirection="column" flexGrow="1">
          <Box mb={2} alignSelf="flex-end">
            {queryProducts.isSuccess && (
              <Typography variant="subtitle2" color="textSecondary">
                {queryProducts.data.count} resultados
              </Typography>
            )}
          </Box>

          {queryProducts.isSuccess && queryProducts.data.results.length ? (
            <>
              <ProductCard products={queryProducts.data.results} />
              <Box display="flex" justifyContent="center" mt={6}>
                <Pagination
                  count={Math.ceil(queryProducts.data?.count / LIMIT)}
                  color="primary"
                  page={page}
                  onChange={handlePageChange}
                />
              </Box>
            </>
          ) : queryProducts.isLoading ? (
            <Box minHeight="70vh" display="flex" flexDirection="column" alignItems="center" mt={6}>
              <Typography variant="h6" color="textSecondary">
                Loading products...
              </Typography>
              <Box mt={3}>
                <CircularProgress></CircularProgress>
              </Box>
            </Box>
          ) : (
            (queryProducts.isError || !queryProducts.data?.results.length) && (
              <Box minHeight="70vh" display="flex" justifyContent="center" mt={6}>
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
