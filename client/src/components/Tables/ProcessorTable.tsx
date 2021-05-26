import { Box, Button } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import { IProcessor } from "src/types";
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from "react-router-dom";
import currencyFormatter from "src/utils/formatCurrency";

interface Props {
  rows: IProcessor[];
  handleDelete: (id: string) => void;
}

const ProcessorTable = ({ rows, handleDelete }: Props) => {
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
            { field: "cores", width: 150, headerName: "Cores" },
            { field: "frequency", width: 150, headerName: "Frequency" },
            { field: "socket", width: 150, headerName: "Socket" },
            { field: "watts", width: 150, headerName: "Watts" },
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
        rows={rows.map((processor: IProcessor) => ({
          id: processor.id,
          product_id: processor.product?.id,
          name: processor.product?.name,
          description: processor.product?.description,
          stock: processor.product?.stock ? "Yes" : "No",
          price: currencyFormatter.format(processor.product!.price),
          brand: processor.product?.brand || "Not found",
          cores: processor.cores,
          frequency: processor.frecuency,
          socket: processor.socket,
          watts: processor.watts,
        }))}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default ProcessorTable;
