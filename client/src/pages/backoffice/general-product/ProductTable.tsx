import { Box, Button, ButtonGroup, Container, Typography } from "@material-ui/core";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridPageChangeParams,
  ValueFormatterParams,
} from "@material-ui/data-grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useCallback, useState } from "react";
import { useIsFetching, useIsMutating } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import CustomLoadingOverlay from "src/components/CustomLoadingOverlay";
import CustomNoRowsOverlay from "src/components/CustomNoRowsOverlay";
import CustomToolbar from "src/components/CustomToolbar";
import DeleteDialog from "src/components/DeleteDialogs/DeleteDialog";
import SnackbarAlert from "src/components/SnackbarAlert";
import { apiRoutes } from "src/hooks/apiRoutes";
import useDelete from "src/hooks/useDelete";
import useGetProducts from "src/hooks/useGetProducts";
import { IProduct } from "src/types";
import { convertText } from "src/utils/convertText";
import currencyFormatter from "src/utils/formatCurrency";

const Products = () => {
  const PAGE_SIZE = 12;
  const [page, setPage] = useState("");
  const [name, setName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const deleteProduct = useDelete<IProduct>("product");
  const isFetching = useIsFetching(apiRoutes.product.cacheString);
  const isMutating = useIsMutating();
  const queryProducts = useGetProducts(page, null, name, PAGE_SIZE);

  const onFilterChange = useCallback((params) => {
    setName(params.filterModel.items[0].value);
  }, []);

  const handlePageChange = (params: GridPageChangeParams) => {
    setPage((params.page + 1).toString());
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

      <Box width="100%" height="525px" marginBottom="50px">
        <DataGrid
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryProducts.isSuccess ? queryProducts.data.count : undefined}
          onPageChange={handlePageChange}
          onFilterModelChange={onFilterChange}
          loading={queryProducts.isLoading || !!isFetching || !!isMutating}
          columns={
            [
              { field: "id", type: "number", hide: true, filterable: false },
              { field: "name", width: 200, headerName: "Product name" },
              { field: "description", width: 200, headerName: "Description", filterable: false },
              { field: "category", width: 150, headerName: "Category", filterable: false },
              {
                field: "price",
                width: 140,
                headerName: "Price",
                headerAlign: "center",
                align: "left",
                type: "number",
                filterable: false,
                valueFormatter: (params: ValueFormatterParams) => currencyFormatter.format(Number(params.value)),
              },
              { field: "stock", width: 100, headerName: "Stock", filterable: false },
              { field: "brand", width: 100, headerName: "Brand", filterable: false },
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
                  category: convertText(product.category?.name) || "Not found",
                  brand: product.brand?.name || "Not found",
                }))
              : []
          }
          components={{
            Toolbar: CustomToolbar,
            NoRowsOverlay: CustomNoRowsOverlay,
            LoadingOverlay: CustomLoadingOverlay,
          }}
        />
      </Box>
    </Container>
  );
};

export default Products;
