import { Box, Button, ButtonGroup } from "@material-ui/core";
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
import { IGetPowerSupplies } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { IPowerSupply } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import CustomToolbar from "../CustomToolbar";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import SnackbarAlert from "../SnackbarAlert";

const PowerSupplyContainer = () => {
  const PAGE_SIZE = 12;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const deletePowerSupply = useDelete<IPowerSupply>("power-supply");
  const queryPowerSupply = useGetAll<IGetPowerSupplies>("power-supply", offset, PAGE_SIZE);

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
        <Button to="create/power-supply" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new power supply
        </Button>
      </Box>

      <DeleteDialog toDelete="power supply" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      <Box height="525px" marginBottom="50px">
        <DataGrid
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryPowerSupply.isSuccess ? queryPowerSupply.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryPowerSupply.isLoading}
          columns={
            [
              { field: "id", type: "number", hide: true },
              { field: "product_id", type: "number", hide: true },
              { field: "name", width: 200, headerName: "Name" },
              { field: "description", width: 200, headerName: "Description" },
              {
                field: "price",
                width: 140,
                headerName: "Price",
                headerAlign: "left",
                align: "center",
                type: "number",
                valueFormatter: (params: ValueFormatterParams) => currencyFormatter.format(Number(params.value)),
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
                valueFormatter: (params: ValueFormatterParams) => params.value + " W",
              },
              {
                field: "edit",
                headerName: "Edit options",
                sortable: false,
                filterable: false,
                width: 400,
                renderCell: (params: GridCellParams) => (
                  <ButtonGroup>
                    <Button to={"/admin/products/edit/" + params.row.product_id} component={RouterLink}>
                      Edit product
                    </Button>
                    <Button to={"edit/power-supply/" + params.row.id} component={RouterLink}>
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
                  product_id: powerSupply.product?.id,
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
          }}
        />
      </Box>
    </>
  );
};

export default PowerSupplyContainer;
