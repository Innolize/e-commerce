import { Box, Button, Typography } from "@material-ui/core";
import DeleteDialog from "../../components/DeleteDialogs/DeleteDialog";
import { Container } from "@material-ui/core";
import { DataGrid, GridColDef, GridCellParams } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
import useProducts from "../../hooks/productHooks/useProducts";
import CustomToolbar from "../../components/CustomToolbar";
import useDeleteProduct from "src/hooks/productHooks/useDeleteProduct";
import { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    height: "500px",
    marginBottom: "50px",
  },
}));

const Products = () => {
  const classes = useStyles();
  const query = useProducts();
  const [deleteId, setDeleteId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const deleteProduct = useDeleteProduct();

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const handleDelete = () => {
    deleteProduct.mutate(deleteId);
    closeDialog();
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Typography variant="h3">Products</Typography>
      </Box>

      {deleteProduct.isSuccess && (
        <Box my={2}>
          <Alert severity="success">Product deleted successfully</Alert>
        </Box>
      )}

      {deleteProduct.isError && (
        <Box my={2}>
          <Alert severity="error">{deleteProduct.error?.message}</Alert>
        </Box>
      )}

      <DeleteDialog
        toDelete="product"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <Button to="products/create" component={RouterLink}>
        Add new
      </Button>

      <Box className={classes.gridContainer}>
        {query.isError ? (
          <DataGrid error rows={[]} columns={[]} />
        ) : (
          <DataGrid
            columns={
              [
                { field: "id", type: "number", width: 70 },
                { field: "name", flex: 1 },
                { field: "description", flex: 1 },
                { field: "image" },
                { field: "price" },
                { field: "stock" },
                { field: "category" },
                { field: "brand" },
                {
                  field: "actions",
                  sortable: false,
                  filterable: false,
                  width: 150,
                  renderCell: (params: GridCellParams) => (
                    <div>
                      <Button
                        to={"products/edit/" + params.row.id}
                        component={RouterLink}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() =>
                          handleClickDeleteBtn(params.row.id as string)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ] as GridColDef[]
            }
            rows={
              query.isLoading
                ? []
                : query.data!.map((product: any) => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image: product.image,
                    price: product.price,
                    stock: product.stock ? "Yes" : "No",
                    category: product.category?.name || "Not found",
                    brand: product.brand?.name || "Not found",
                  }))
            }
            loading={query.isLoading}
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        )}
      </Box>
    </Container>
  );
};

export default Products;
