import { Box, Button, ButtonGroup } from "@material-ui/core";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  ValueFormatterParams,
} from "@material-ui/data-grid";
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
              width: 140,
              headerName: "Price",
              headerAlign: "left",
              align: "center",
              type: "number",
              valueFormatter: (params: ValueFormatterParams) =>
                currencyFormatter.format(Number(params.value)),
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
              valueFormatter: (params: ValueFormatterParams) =>
                params.value + " GHz",
            },
            { field: "socket", width: 150, headerName: "Socket" },
            {
              field: "watts",
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
                    to={"edit/processor/" + params.row.id}
                    component={RouterLink}
                  >
                    Edit processor
                  </Button>
                  <Button onClick={() => handleDelete(params.row.id as string)}>
                    Delete
                  </Button>
                </ButtonGroup>
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
          price: processor.product!.price,
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
