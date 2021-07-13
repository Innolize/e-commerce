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
import { IGetCabinets } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { ICabinet } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import CustomLoadingOverlay from "../CustomLoadingOverlay";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import CustomToolbar from "../CustomToolbar";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import SnackbarAlert from "../SnackbarAlert";

const CabinetContainer = () => {
  const PAGE_SIZE = 12;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const deleteCabinet = useDelete<ICabinet>("cabinet");
  const queryCabinet = useGetAll<IGetCabinets>("cabinet", offset, PAGE_SIZE);
  const isFetching = useIsFetching(apiOptions.cabinet.cacheString);
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
    deleteCabinet.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteCabinet.isSuccess ? (
        <SnackbarAlert severity="success" text="Cabinet deleted successfully"></SnackbarAlert>
      ) : (
        deleteCabinet.isError && <SnackbarAlert severity="error" text="Something went wrong"></SnackbarAlert>
      )}
      <Box mb={1}>
        <Button to="create/cabinet" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new cabinet
        </Button>
      </Box>

      <DeleteDialog toDelete="cabinet" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      <Box height="525px" marginBottom="50px">
        <DataGrid
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryCabinet.isSuccess ? queryCabinet.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryCabinet.isLoading || !!isFetching || !!isMutating}
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
              { field: "stock", headerName: "Stock" },
              { field: "brand", headerName: "Brand" },
              { field: "size", headerName: "Size" },
              { field: "generic_pws", width: 138, headerName: "Generic PWS" },
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
                    <Button to={"edit/cabinet/" + params.row.id} component={RouterLink}>
                      Edit specs
                    </Button>
                    <Button onClick={() => handleClickDeleteBtn(params.row.id as string)}>Delete</Button>
                  </ButtonGroup>
                ),
              },
            ] as GridColDef[]
          }
          rows={
            queryCabinet.isSuccess
              ? queryCabinet.data.results.map((cabinet: ICabinet) => ({
                  id: cabinet.id,
                  product_id: cabinet.product?.id,
                  name: cabinet.product?.name,
                  description: cabinet.product?.description,
                  stock: cabinet.product?.stock ? "Yes" : "No",
                  price: cabinet.product!.price,
                  brand: cabinet.product?.brand.name || "Not found",
                  size: cabinet.size,
                  generic_pws: cabinet.generic_pws ? "Yes" : "No",
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

export default CabinetContainer;
