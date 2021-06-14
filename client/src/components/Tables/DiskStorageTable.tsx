import { Box, Button, ButtonGroup } from "@material-ui/core";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  ValueFormatterParams,
} from "@material-ui/data-grid";
import { IDiskStorage } from "src/types";
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from "react-router-dom";
import currencyFormatter from "src/utils/formatCurrency";

interface Props {
  rows: IDiskStorage[];
  handleDelete: (id: string) => void;
}

const DiskStorageTable = ({ rows, handleDelete }: Props) => {
  return (
    <Box height="500px" marginBottom="50px">
      <DataGrid
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
              valueFormatter: (params: ValueFormatterParams) =>
                currencyFormatter.format(Number(params.value)),
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
              valueFormatter: (params: ValueFormatterParams) =>
                params.value + " MB",
            },
            {
              field: "total_storage",
              width: 150,
              headerName: "Total Storage",
              headerAlign: "left",
              align: "center",
              type: "number",
              valueFormatter: (params: ValueFormatterParams) =>
                params.value + " GB",
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
              valueFormatter: (params: ValueFormatterParams) =>
                params.value + " W",
            },
            {
              field: "edit",
              headerName: "Edit options",
              sortable: false,
              filterable: false,
              width: 300,
              renderCell: (params: GridCellParams) => (
                <ButtonGroup>
                  <Button
                    to={"edit/disk-storage/" + params.row.id}
                    component={RouterLink}
                  >
                    Edit disk storage
                  </Button>
                  <Button onClick={() => handleDelete(params.row.id as string)}>
                    Delete
                  </Button>
                </ButtonGroup>
              ),
            },
          ] as GridColDef[]
        }
        rows={rows.map((diskStorage: IDiskStorage) => ({
          id: diskStorage.id,
          product_id: diskStorage.product?.id,
          name: diskStorage.product?.name,
          description: diskStorage.product?.description,
          stock: diskStorage.product?.stock ? "Yes" : "No",
          price: diskStorage.product!.price,
          brand: diskStorage.product?.brand || "Not found",
          mbs: diskStorage.mbs,
          total_storage: diskStorage.total_storage,
          type: diskStorage.type,
          watts: diskStorage.watts,
        }))}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default DiskStorageTable;
