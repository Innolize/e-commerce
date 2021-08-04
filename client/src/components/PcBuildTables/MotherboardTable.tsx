import { Box, Button, ButtonGroup } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef, GridValueFormatterParams } from "@material-ui/data-grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { useIsFetching, useIsMutating } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { apiRoutes } from "src/hooks/apiRoutes";
import { IGetAllMotherboards } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { IMotherboard } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import CustomLoadingOverlay from "../CustomLoadingOverlay";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import CustomToolbar from "../CustomToolbar";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import SnackbarAlert from "../SnackbarAlert";

const MotherboardContainer = () => {
  const PAGE_SIZE = 12;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const deleteMotherboard = useDelete<IMotherboard>("motherboard");
  const queryMotherboards = useGetAll<IGetAllMotherboards>("motherboard", offset, PAGE_SIZE);
  const isFetching = useIsFetching(apiRoutes.motherboard.cacheString);
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
    deleteMotherboard.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteMotherboard.isSuccess ? (
        <SnackbarAlert severity="success" text="Motherboard deleted successfully"></SnackbarAlert>
      ) : (
        deleteMotherboard.isError && <SnackbarAlert severity="error" text="Something went wrong"></SnackbarAlert>
      )}

      <Box mb={1}>
        <Button to="create/motherboard" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new motherboard
        </Button>
      </Box>

      <DeleteDialog toDelete="motherboard" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      <Box height="525px" marginBottom="50px">
        <DataGrid
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryMotherboards.isSuccess ? queryMotherboards.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryMotherboards.isLoading || !!isFetching || !!isMutating}
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
                valueFormatter: (params: GridValueFormatterParams) => currencyFormatter.format(Number(params.value)),
              },
              { field: "stock", width: 100, headerName: "Stock" },
              { field: "brand", width: 100, headerName: "Brand" },
              { field: "cpu_brand", width: 150, headerName: "CPU Brand" },
              { field: "cpu_socket", width: 150, headerName: "CPU Socket" },
              {
                field: "min_frec",
                width: 120,
                headerName: "Min Frec",
                type: "number",
                valueFormatter: (params: GridValueFormatterParams) => params.value + " MHz",
              },
              {
                field: "max_frec",
                width: 120,
                headerName: "Max Frec",
                type: "number",
                valueFormatter: (params: GridValueFormatterParams) => params.value + " MHz",
              },
              { field: "ram_version", width: 150, headerName: "RAM version" },
              { field: "model_size", width: 150, headerName: "Model Size" },
              { field: "video_socket", width: 150, headerName: "Video Socket" },
              {
                field: "edit",
                headerName: "Edit options",
                sortable: false,
                filterable: false,
                width: 450,
                renderCell: (params: GridCellParams) => (
                  <ButtonGroup>
                    <Button to={"/admin/products/edit/" + params.row.productId} component={RouterLink}>
                      Edit product
                    </Button>
                    <Button to={"edit/motherboard/" + params.row.id} component={RouterLink}>
                      Edit specs
                    </Button>
                    <Button onClick={() => handleClickDeleteBtn(params.row.id as string)}>Delete</Button>
                  </ButtonGroup>
                ),
              },
            ] as GridColDef[]
          }
          rows={
            queryMotherboards.isSuccess
              ? queryMotherboards.data.results.map((motherboard: IMotherboard) => ({
                  id: motherboard.id,
                  product_id: motherboard.product.id,
                  name: motherboard.product.name,
                  description: motherboard.product.description,
                  stock: motherboard.product.stock ? "Yes" : "No",
                  price: motherboard.product.price,
                  brand: motherboard.product.brand.name || "Not found",
                  cpu_brand: motherboard.cpuBrand,
                  cpu_socket: motherboard.cpuSocket,
                  min_frec: motherboard.minFrec,
                  max_frec: motherboard.maxFrec,
                  model_size: motherboard.modelSize,
                  ram_version: motherboard.ramVersion,
                  video_socket: motherboard.videoSocket,
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

export default MotherboardContainer;
