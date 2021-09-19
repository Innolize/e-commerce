import { Box, Button, ButtonGroup } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef, GridValueFormatterParams } from "@material-ui/data-grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { useIsFetching, useIsMutating } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { apiRoutes } from "src/hooks/apiRoutes";
import { IGetAllRams } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { IRam } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import CustomLoadingOverlay from "../CustomLoadingOverlay";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import CustomToolbar from "../CustomToolbar";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import SnackbarAlert from "../SnackbarAlert";

const RamTableContainer = () => {
  const PAGE_SIZE = 12;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const deleteRam = useDelete<IRam>("ram");
  const queryRams = useGetAll<IGetAllRams>("ram", offset, PAGE_SIZE);
  const isFetching = useIsFetching(apiRoutes.ram.cacheString);
  const isMutating = useIsMutating();

  const handlePageChange = (page: number) => {
    setOffset(page * PAGE_SIZE);
  };

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteRam.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteRam.isSuccess ? (
        <SnackbarAlert severity="success" text="Ram deleted successfully"></SnackbarAlert>
      ) : (
        deleteRam.isError && <SnackbarAlert severity="error" text="Something went wrong"></SnackbarAlert>
      )}
      <Box mb={1}>
        <Button to="create/ram" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new ram
        </Button>
      </Box>

      <DeleteDialog toDelete="ram" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      <Box height="525px" marginBottom="50px">
        <DataGrid
          rowsPerPageOptions={[12]}
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
          loading={queryRams.isLoading || !!isFetching || !!isMutating}
          columns={
            [
              { field: "id", type: "number", hide: true },
              { field: "productId", type: "number", hide: true },
              { field: "name", width: 200, headerName: "Name" },
              { field: "description", width: 200, headerName: "Description" },
              {
                field: "price",
                width: 140,
                headerName: "Price",
                headerAlign: "left",
                align: "center",
                type: "number",
                valueFormatter: (params: GridValueFormatterParams) => currencyFormatter.format(Number(params.value)),
              },
              { field: "stock", width: 100, headerName: "Stock" },
              { field: "brand", width: 100, headerName: "Brand" },
              { field: "ramVersion", width: 150, headerName: "Ram Version" },
              { field: "memory", width: 150, headerName: "Memory" },
              { field: "minFrec", width: 150, headerName: "Min Frec" },
              { field: "maxFrec", width: 150, headerName: "Max Frec" },
              {
                field: "watts",
                headerName: "Watts",
                headerAlign: "left",
                align: "center",
                type: "number",
                valueFormatter: (params: GridValueFormatterParams) => params.value + " W",
              },
              {
                field: "edit",
                headerName: "Edit options",
                sortable: false,
                filterable: false,
                width: 400,
                renderCell: (params: GridCellParams) => (
                  <ButtonGroup>
                    <Button to={"/admin/products/edit/" + params.row.productId} component={RouterLink}>
                      Edit product
                    </Button>
                    <Button to={"edit/ram/" + params.row.id} component={RouterLink}>
                      Edit specs
                    </Button>
                    <Button onClick={() => handleClickDeleteBtn(params.row.id as string)}>Delete</Button>
                  </ButtonGroup>
                ),
              },
            ] as GridColDef[]
          }
          rows={
            queryRams.isSuccess
              ? queryRams.data.results.map((ram: IRam) => ({
                  id: ram.id,
                  productId: ram.product.id,
                  name: ram.product.name,
                  description: ram.product.description,
                  stock: ram.product.stock ? "Yes" : "No",
                  price: ram.product.price,
                  brand: ram.product.brand.name || "Not found",
                  memory: ram.memory,
                  ramVersion: ram.ramVersion,
                  watts: ram.watts,
                  minFrec: ram.minFrec,
                  maxFrec: ram.maxFrec,
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
    </>
  );
};

export default RamTableContainer;
