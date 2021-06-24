import { Box, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { IGetProducts } from "src/hooks/types";
import useScreenSize from "use-screen-size";
import DesktopCard from "./DesktopCard";
import MobileCard from "./MobileCard";

interface Props {
  productData: IGetProducts;
  page: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  LIMIT: number;
}

const ProductsContainer = ({ productData, page, LIMIT, handlePageChange }: Props) => {
  const screenSize = useScreenSize();

  if (!productData.results.length) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography variant="h6" color="textSecondary">
          No products found.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Box mb={3} mt={2}>
          <Typography align="right" variant="subtitle2" color="textSecondary">
            {productData.count} resultados
          </Typography>
        </Box>
        {screenSize.width <= 768 ? (
          <MobileCard products={productData.results} />
        ) : (
          <DesktopCard products={productData.results} />
        )}
      </Box>
      <Box display="flex" justifyContent="center" mt={6}>
        <Pagination
          count={Math.ceil(productData.count / LIMIT)}
          color="secondary"
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </>
  );
};

export default ProductsContainer;
