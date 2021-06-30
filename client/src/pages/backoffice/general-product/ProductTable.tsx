import { Box, Button, ButtonGroup, Container, Typography } from "@material-ui/core";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridPageChangeParams,
  ValueFormatterParams,
} from "@material-ui/data-grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import CustomToolbar from "src/components/CustomToolbar";
import DeleteDialog from "src/components/DeleteDialogs/DeleteDialog";
import SnackbarAlert from "src/components/SnackbarAlert";
import { IGetProducts } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { IProduct } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";

const Products = () => {
  const PAGE_SIZE = 12;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const deleteProduct = useDelete<IProduct>("product");
  const queryProducts = useGetAll<IGetProducts>("product", offset, PAGE_SIZE);

  const handlePageChange = (params: GridPageChangeParams) => {
    setOffset(params.page * PAGE_SIZE);
  };

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

      <DeleteDialog toDelete="product" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      {deleteProduct.isSuccess ? (
        <SnackbarAlert severity="success" text="Product deleted successfully"></SnackbarAlert>
      ) : (
        deleteProduct.isError && <SnackbarAlert severity="error" text="Something went wrong"></SnackbarAlert>
      )}

      <Box mb={1}>
        <Button to="products/create" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new product
        </Button>
      </Box>

      <Box width="100%" height="500px" marginBottom="50px">
        <DataGrid
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryProducts.isSuccess ? queryProducts.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryProducts.isLoading}
          columns={
            [
              { field: "id", type: "number", hide: true },
              { field: "name", width: 200, headerName: "Product name" },
              { field: "description", width: 200, headerName: "Description" },
              { field: "category", width: 150, headerName: "Category" },
              {
                field: "price",
                width: 140,
                headerName: "Price",
                headerAlign: "center",
                align: "left",
                type: "number",
                valueFormatter: (params: ValueFormatterParams) => currencyFormatter.format(Number(params.value)),
              },
              { field: "stock", width: 100, headerName: "Stock" },
              { field: "brand", width: 100, headerName: "Brand" },
              {
                field: "Edit options",
                sortable: false,
                filterable: false,
                width: 300,
                renderCell: (params: GridCellParams) => (
                  <ButtonGroup>
                    <Button variant="outlined" to={"products/edit/" + params.row.id} component={RouterLink}>
                      Edit
                    </Button>
                    <Button variant="outlined" onClick={() => handleClickDeleteBtn(params.row.id as string)}>
                      Delete
                    </Button>
                  </ButtonGroup>
                ),
              },
            ] as GridColDef[]
          }
          rows={
            queryProducts.isSuccess
              ? queryProducts.data.results.map((product: IProduct) => ({
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  stock: product.stock ? "Yes" : "No",
                  category: product.category?.name || "Not found",
                  brand: product.brand?.name || "Not found",
                }))
              : []
          }
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
    </Container>
  );
};

export default Products;
