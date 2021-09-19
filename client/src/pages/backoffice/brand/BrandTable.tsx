import { Box, Button, ButtonGroup, Container, Typography } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { useIsFetching, useIsMutating } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import CustomLoadingOverlay from "src/components/CustomLoadingOverlay";
import CustomNoRowsOverlay from "src/components/CustomNoRowsOverlay";
import CustomToolbar from "src/components/CustomToolbar";
import SnackbarAlert from "src/components/SnackbarAlert";
import { apiRoutes } from "src/hooks/apiRoutes";
import { IGetAllBrands } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { IBrand } from "src/types";
import DeleteDialog from "../../../components/DeleteDialogs/DeleteDialog";

const BrandTable = () => {
  const LIMIT = 12;
  const [offset, setOffset] = useState(0);
  const [deleteId, setDeleteId] = useState<string>("");
  const isFetching = useIsFetching(apiRoutes.brand.cacheString);
  const isMutating = useIsMutating();
  const [open, setOpen] = useState(false);
  const deleteBrand = useDelete<IBrand>("brand");
  const queryBrands = useGetAll<IGetAllBrands>("brand", offset, LIMIT);

  const handlePageChange = (page: number) => {
    setOffset(page * LIMIT);
  };

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const handleDelete = () => {
    deleteBrand.mutate(deleteId);
    closeDialog();
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Typography variant="h3">Brands</Typography>
      </Box>

      {deleteBrand.isSuccess ? (
        <SnackbarAlert severity="success" text="Brand deleted successfully"></SnackbarAlert>
      ) : (
        deleteBrand.isError && <SnackbarAlert severity="error" text="Something went wrong"></SnackbarAlert>
      )}

      <DeleteDialog toDelete="brand" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      <Box mb={1}>
        <Button to="brands/create" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new brand
        </Button>
      </Box>

      <Box height="500px" marginBottom="50px">
        <DataGrid
          rowsPerPageOptions={[12]}
          pagination
          paginationMode="server"
          pageSize={LIMIT}
          rowCount={queryBrands.isSuccess ? queryBrands.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryBrands.isLoading || !!isFetching || !!isMutating}
          columns={
            [
              { field: "id", type: "number", headerName: "ID", hide: true },
              { field: "name", width: 250, headerName: "Brand name" },
              {
                field: "Edit options",
                sortable: false,
                filterable: false,
                width: 300,
                renderCell: (params: GridCellParams) => (
                  <ButtonGroup>
                    <Button to={"brands/edit/" + params.row.id} component={RouterLink}>
                      Edit brand
                    </Button>
                    <Button onClick={() => handleClickDeleteBtn(params.row.id as string)}>Delete</Button>
                  </ButtonGroup>
                ),
              },
            ] as GridColDef[]
          }
          rows={
            queryBrands.isSuccess
              ? queryBrands.data.results.map((brand: IBrand) => ({
                  id: brand.id,
                  name: brand.name,
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

export default BrandTable;
