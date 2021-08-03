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
import { apiRoutes } from "src/hooks/apiRoutes";
import { IGetAllVideoCards } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { IVideoCard } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import CustomLoadingOverlay from "../CustomLoadingOverlay";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import CustomToolbar from "../CustomToolbar";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import SnackbarAlert from "../SnackbarAlert";

const VideoCardContainer = () => {
  const PAGE_SIZE = 12;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const deleteVideoCard = useDelete<IVideoCard>("video-card");
  const queryVideoCards = useGetAll<IGetAllVideoCards>("video-card", offset, PAGE_SIZE);
  const isFetching = useIsFetching(apiRoutes["video-card"].cacheString);
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
    deleteVideoCard.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteVideoCard.isSuccess ? (
        <SnackbarAlert severity="success" text="Video card deleted successfully"></SnackbarAlert>
      ) : (
        deleteVideoCard.isError && <SnackbarAlert severity="error" text="Something went wrong"></SnackbarAlert>
      )}
      <Box mb={1}>
        <Button to="create/video-card" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new video card
        </Button>
      </Box>

      <DeleteDialog toDelete="video card" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      <Box height="525px" marginBottom="50px">
        <DataGrid
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryVideoCards.isSuccess ? queryVideoCards.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryVideoCards.isLoading || !!isFetching || !!isMutating}
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
                valueFormatter: (params: ValueFormatterParams) => currencyFormatter.format(Number(params.value)),
              },
              { field: "stock", headerName: "Stock" },
              { field: "brand", width: 120, headerName: "Brand" },
              { field: "version", width: 120, headerName: "Version" },
              {
                field: "memory",
                width: 110,
                headerName: "Memory",
                type: "number",
                valueFormatter: (params: ValueFormatterParams) => params.value + " GB",
              },
              {
                field: "clockSpeed",
                width: 140,
                headerName: "Clock Speed",
                type: "number",
                valueFormatter: (params: ValueFormatterParams) => params.value + " MHz",
              },
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
                    <Button to={"/admin/products/edit/" + params.row.productId} component={RouterLink}>
                      Edit product
                    </Button>
                    <Button to={"edit/video-card/" + params.row.id} component={RouterLink}>
                      Edit specs
                    </Button>
                    <Button onClick={() => handleClickDeleteBtn(params.row.id as string)}>Delete</Button>
                  </ButtonGroup>
                ),
              },
            ] as GridColDef[]
          }
          rows={
            queryVideoCards.isSuccess
              ? queryVideoCards.data.results.map((videoCard: IVideoCard) => ({
                  id: videoCard.id,
                  productId: videoCard.product?.id,
                  name: videoCard.product?.name,
                  description: videoCard.product?.description,
                  stock: videoCard.product?.stock ? "Yes" : "No",
                  price: videoCard.product?.price,
                  brand: videoCard.product?.brand.name || "Not found",
                  memory: videoCard.memory,
                  version: videoCard.version,
                  clockSpeed: videoCard.clockSpeed,
                  watts: videoCard.watts,
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

export default VideoCardContainer;
