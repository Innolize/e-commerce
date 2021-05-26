import { Box, Button } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import { ICabinet } from "src/types";
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from "react-router-dom";
import currencyFormatter from "src/utils/formatCurrency";

interface Props {
  rows: ICabinet[];
  handleDelete: (id: string) => void;
}

const CabinetTable = ({ rows, handleDelete }: Props) => {
  return (
    <Box height="500px" marginBottom="50px">
      <DataGrid
        columns={
          [
            { field: "id", type: "number" },
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
            { field: "size", width: 150, headerName: "Size" },
            { field: "generic_pws", width: 150, headerName: "Generic PWS" },
            {
              field: "edit",
              sortable: false,
              filterable: false,
              width: 300,
              renderCell: (params: GridCellParams) => (
                <div>
                  <Button
                    to={"edit/" + params.row.product_id}
                    component={RouterLink}
                  >
                    General
                  </Button>
                  <Button
                    to={"edit_details/" + params.row.id}
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
        rows={rows.map((cabinet: ICabinet) => ({
          id: cabinet.id,
          product_id: cabinet.product?.id,
          name: cabinet.product?.name,
          description: cabinet.product?.description,
          stock: cabinet.product?.stock ? "Yes" : "No",
          price: currencyFormatter.format(cabinet.product!.price),
          brand: cabinet.product?.brand || "Not found",
          size: cabinet.size,
          generic_pws: cabinet.generic_pws ? "Yes" : "No",
        }))}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default CabinetTable;
