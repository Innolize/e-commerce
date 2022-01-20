import { Box, Button, ButtonGroup } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef, GridValueFormatterParams } from "@material-ui/data-grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { useIsFetching, useIsMutating } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { apiRoutes } from "src/hooks/apiRoutes";
import { IGetAllProcessors } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { IProcessor } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import CustomLoadingOverlay from "../CustomLoadingOverlay";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import CustomToolbar from "../CustomToolbar";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import SnackbarAlert from "../SnackbarAlert";

const ProcessorContainer = () => {
  const PAGE_SIZE = 12;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const deleteProcessor = useDelete<IProcessor>("processor");
  const queryProcessors = useGetAll<IGetAllProcessors>("processor", offset, PAGE_SIZE);
  const isFetching = useIsFetching(apiRoutes.processor.cacheString);
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
    deleteProcessor.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteProcessor.isSuccess ? (
        <SnackbarAlert severity="success" text="Processor deleted successfully"></SnackbarAlert>
      ) : (
        deleteProcessor.isError && <SnackbarAlert severity="error" text="Something went wrong"></SnackbarAlert>
      )}
      <Box mb={1}>
        <Button to="create" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new processor
        </Button>
      </Box>

      <DeleteDialog toDelete="processor" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      <Box height="525px" marginBottom="50px">
        <DataGrid
          rowsPerPageOptions={[12]}
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryProcessors.isSuccess ? queryProcessors.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryProcessors.isLoading || !!isFetching || !!isMutating}
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
              { field: "stock", headerName: "Stock" },
              { field: "brand", headerName: "Brand" },
              {
                field: "cores",
                type: "number",
                headerAlign: "left",
                align: "center",
                headerName: "Cores",
              },
              {
                field: "frequency",
                width: 150,
                headerName: "Frequency",
                headerAlign: "left",
                align: "center",
                type: "number",
                valueFormatter: (params: GridValueFormatterParams) => params.value + " GHz",
              },
              { field: "socket", width: 150, headerName: "Socket" },
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
            queryProcessors.isSuccess
              ? queryProcessors.data.results.map((processor: IProcessor) => ({
                  id: processor.id,
                  productId: processor.product?.id,
                  name: processor.product?.name,
                  description: processor.product?.description,
                  stock: processor.product?.stock ? "Yes" : "No",
                  price: processor.product!.price,
                  brand: processor.product?.brand.name || "Not found",
                  cores: processor.cores,
                  frequency: processor.frecuency,
                  socket: processor.socket,
                  watts: processor.watts,
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

export default ProcessorContainer;
