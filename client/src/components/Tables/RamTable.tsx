import { Box, Button } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import { IRam } from "src/types";
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from "react-router-dom";
import currencyFormatter from "src/utils/formatCurrency";

interface Props {
  rows: IRam[];
  handleDelete: (id: string) => void;
}

const RamTable = ({ rows, handleDelete }: Props) => {
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
            { field: "ram_version", width: 150, headerName: "Ram Version" },
            { field: "memory", width: 150, headerName: "Memory" },
            { field: "min_frec", width: 150, headerName: "Min Frec" },
            { field: "max_frec", width: 150, headerName: "Max Frec" },
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
        rows={rows.map((ram: IRam) => ({
          id: ram.id,
          product_id: ram.product?.id,
          name: ram.product?.name,
          description: ram.product?.description,
          stock: ram.product?.stock ? "Yes" : "No",
          price: currencyFormatter.format(ram.product!.price),
          brand: ram.product?.brand || "Not found",
          memory: ram.memory,
          ram_version: ram.ram_version,
          watts: ram.watts,
          min_frec: ram.min_frec,
          max_frec: ram.max_frec,
        }))}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default RamTable;
