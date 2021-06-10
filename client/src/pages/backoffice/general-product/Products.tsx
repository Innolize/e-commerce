import { Box, Button, Container, Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import DeleteDialog from "src/components/DeleteDialogs/DeleteDialog";
import SnackbarAlert from "src/components/SnackbarAlert";
import GeneralProductTable from "src/components/Tables/GeneralProductTable";
import TableLayout from "src/components/Tables/TableLayout";
import useDeleteProduct from "src/hooks/productHooks/generalProducts/useDeleteProduct";
import useProducts from "src/hooks/productHooks/generalProducts/useProducts";

const Products = () => {
  const [deleteId, setDeleteId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const deleteProduct = useDeleteProduct();
  const queryProducts = useProducts();

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteProduct.mutate(deleteId);
    closeDialog();
  };

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Typography variant="h3">Products</Typography>
      </Box>

      <DeleteDialog
        toDelete="product"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      {deleteProduct.isSuccess ? (
        <SnackbarAlert
          severity="success"
          text="Product deleted successfully"
        ></SnackbarAlert>
      ) : (
        deleteProduct.isError && (
          <SnackbarAlert
            severity="error"
            text="Something went wrong"
          ></SnackbarAlert>
        )
      )}

      <Box mb={1}>
        <Button
          to="products/create"
          component={RouterLink}
          variant="outlined"
          endIcon={<AddCircleOutlineIcon />}
        >
          Add new product
        </Button>
      </Box>

      <TableLayout
        Table={GeneralProductTable}
        handleDelete={handleClickDeleteBtn}
        isLoading={queryProducts.isLoading}
        isSuccess={queryProducts.isSuccess}
        isError={queryProducts.isError}
        rows={queryProducts.data}
      />
    </Container>
  );
};

export default Products;
