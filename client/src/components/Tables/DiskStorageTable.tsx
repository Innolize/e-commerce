import { Box, Button } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
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
              width: 120,
              headerName: "Price",
            },
            { field: "stock", width: 100, headerName: "Stock" },
            { field: "brand", width: 100, headerName: "Brand" },
            { field: "mbs", width: 150, headerName: "MBS" },
            { field: "total_storage", width: 150, headerName: "Total Storage" },
            { field: "type", width: 150, headerName: "Type" },
            { field: "watts", width: 150, headerName: "Watts" },
            {
              field: "edit",
              sortable: false,
              filterable: false,
              width: 300,
              renderCell: (params: GridCellParams) => (
                <div>
                  <Button
                    to={"products/edit/" + params.row.product_id}
                    component={RouterLink}
                  >
                    General
                  </Button>
                  <Button
                    to={"products/edit/" + params.row.id}
                    component={RouterLink}
                  >
                    Details
                  </Button>
                  <Button onClick={() => handleDelete(params.row.id as string)}>
                    Delete
                  </Button>
                </div>
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
          price: currencyFormatter.format(diskStorage.product!.price),
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
