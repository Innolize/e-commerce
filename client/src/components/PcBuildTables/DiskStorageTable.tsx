import { Box, Button, ButtonGroup } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef, GridValueFormatterParams } from "@material-ui/data-grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { useIsFetching, useIsMutating } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { apiRoutes } from "src/hooks/apiRoutes";
import { IGetAllDiskStorages } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { IDiskStorage } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import CustomLoadingOverlay from "../CustomLoadingOverlay";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import CustomToolbar from "../CustomToolbar";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import SnackbarAlert from "../SnackbarAlert";

const DiskStorageContainer = () => {
  const PAGE_SIZE = 12;
  const [offset, setOffset] = useState(0);
  const [deleteId, setDeleteId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const deleteDiskStorage = useDelete<IDiskStorage>("disk-storage");
  const queryDiskStorages = useGetAll<IGetAllDiskStorages>("disk-storage", offset, PAGE_SIZE);
  const isFetching = useIsFetching(apiRoutes["disk-storage"].cacheString);
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
    deleteDiskStorage.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteDiskStorage.isSuccess ? (
        <SnackbarAlert severity="success" text="Disk storage deleted successfully"></SnackbarAlert>
      ) : (
        deleteDiskStorage.isError && <SnackbarAlert severity="error" text="Something went wrong"></SnackbarAlert>
      )}

      <Box mb={1}>
        <Button to="create/disk-storage" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new disk storage
        </Button>
      </Box>

      <DeleteDialog toDelete="disk storage" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      <Box height="525px" marginBottom="50px">
        <DataGrid
          rowsPerPageOptions={[12]}
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryDiskStorages.isSuccess ? queryDiskStorages.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryDiskStorages.isLoading || !!isFetching || !!isMutating}
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
              {
                field: "stock",
                headerName: "Stock",
              },
              {
                field: "brand",
                headerName: "Brand",
              },
              {
                field: "mbs",
                width: 120,
                headerName: "MB/S",
                headerAlign: "left",
                align: "center",
                type: "number",
                valueFormatter: (params: GridValueFormatterParams) => params.value + " MB",
              },
              {
                field: "totalStorage",
                width: 150,
                headerName: "Total Storage",
                headerAlign: "left",
                align: "center",
                type: "number",
                valueFormatter: (params: GridValueFormatterParams) => params.value + " GB",
              },
              {
                field: "type",
                headerName: "Type",
              },
              {
                field: "watts",
                width: 120,
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
                    <Button to={"edit/disk-storage/" + params.row.id} component={RouterLink}>
                      Edit specs
                    </Button>
                    <Button onClick={() => handleClickDeleteBtn(params.row.id as string)}>Delete</Button>
                  </ButtonGroup>
                ),
              },
            ] as GridColDef[]
          }
          rows={
            queryDiskStorages.isSuccess
              ? queryDiskStorages.data.results.map((diskStorage: IDiskStorage) => ({
                  id: diskStorage.id,
                  productId: diskStorage.product?.id,
                  name: diskStorage.product?.name,
                  description: diskStorage.product?.description,
                  stock: diskStorage.product?.stock ? "Yes" : "No",
                  price: diskStorage.product!.price,
                  brand: diskStorage.product?.brand.name || "Not found",
                  mbs: diskStorage.mbs,
                  totalStorage: diskStorage.totalStorage,
                  type: diskStorage.type,
                  watts: diskStorage.watts,
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

export default DiskStorageContainer;
