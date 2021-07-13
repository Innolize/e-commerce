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
import { useIsFetching, useIsMutating } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { apiOptions } from "src/hooks/apiOptions";
import { IGetRams } from "src/hooks/types";
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
  const queryRams = useGetAll<IGetRams>("ram", offset, PAGE_SIZE);
  const isFetching = useIsFetching(apiOptions.ram.cacheString);
  const isMutating = useIsMutating();

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
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryRams.isSuccess ? queryRams.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryRams.isLoading || !!isFetching || !!isMutating}
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
              { field: "ram_version", width: 150, headerName: "Ram Version" },
              { field: "memory", width: 150, headerName: "Memory" },
              { field: "min_frec", width: 150, headerName: "Min Frec" },
              { field: "max_frec", width: 150, headerName: "Max Frec" },
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
                  product_id: ram.product?.id,
                  name: ram.product?.name,
                  description: ram.product?.description,
                  stock: ram.product?.stock ? "Yes" : "No",
                  price: ram.product!.price,
                  brand: ram.product?.brand.name || "Not found",
                  memory: ram.memory,
                  ram_version: ram.ram_version,
                  watts: ram.watts,
                  min_frec: ram.min_frec,
                  max_frec: ram.max_frec,
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
