import { Box, Button, ButtonGroup } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef, GridValueFormatterParams } from "@material-ui/data-grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { useIsFetching, useIsMutating } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { apiRoutes } from "src/hooks/apiRoutes";
import { IGetAllPowerSupplies } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { IPowerSupply } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import CustomLoadingOverlay from "../CustomLoadingOverlay";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import CustomToolbar from "../CustomToolbar";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import SnackbarAlert from "../SnackbarAlert";

const PowerSupplyContainer = () => {
  const PAGE_SIZE = 12;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const deletePowerSupply = useDelete<IPowerSupply>("power-supply");
  const queryPowerSupply = useGetAll<IGetAllPowerSupplies>("power-supply", offset, PAGE_SIZE);
  const isFetching = useIsFetching(apiRoutes["power-supply"].cacheString);
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
    deletePowerSupply.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deletePowerSupply.isSuccess ? (
        <SnackbarAlert severity="success" text="Power supply deleted successfully"></SnackbarAlert>
      ) : (
        deletePowerSupply.isError && <SnackbarAlert severity="error" text="Something went wrong"></SnackbarAlert>
      )}
      <Box mb={1}>
        <Button to="create" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new power supply
        </Button>
      </Box>

      <DeleteDialog toDelete="power supply" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      <Box height="525px" marginBottom="50px">
        <DataGrid
          rowsPerPageOptions={[12]}
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryPowerSupply.isSuccess ? queryPowerSupply.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryPowerSupply.isLoading || !!isFetching || !!isMutating}
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
              { field: "certification", width: 150, headerName: "Certification" },
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
                    <Button to={"edit/" + params.row.id} component={RouterLink}>
                      Edit specs
                    </Button>
                    <Button onClick={() => handleClickDeleteBtn(params.row.id as string)}>Delete</Button>
                  </ButtonGroup>
                ),
              },
            ] as GridColDef[]
          }
          rows={
            queryPowerSupply.isSuccess
              ? queryPowerSupply.data.results.map((powerSupply: IPowerSupply) => ({
                  id: powerSupply.id,
                  productId: powerSupply.product?.id,
                  name: powerSupply.product?.name,
                  description: powerSupply.product?.description,
                  stock: powerSupply.product?.stock ? "Yes" : "No",
                  price: powerSupply.product!.price,
                  brand: powerSupply.product?.brand.name || "Not found",
                  certification: powerSupply.certification,
                  watts: powerSupply.watts,
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

export default PowerSupplyContainer;
