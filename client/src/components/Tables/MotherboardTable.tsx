import { Box, Button, ButtonGroup } from "@material-ui/core";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  ValueFormatterParams,
} from "@material-ui/data-grid";
import { IMotherboard } from "src/types";
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from "react-router-dom";
import currencyFormatter from "src/utils/formatCurrency";

interface Props {
  rows: IMotherboard[];
  handleDelete: (id: string) => void;
}

const MotherboardTable = ({ rows, handleDelete }: Props) => {
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
            { field: "stock", width: 100, headerName: "Stock" },
            { field: "brand", width: 100, headerName: "Brand" },
            { field: "cpu_brand", width: 150, headerName: "CPU Brand" },
            { field: "cpu_socket", width: 150, headerName: "CPU Socket" },
            {
              field: "min_frec",
              width: 120,
              headerName: "Min Frec",
              type: "number",
              valueFormatter: (params: ValueFormatterParams) =>
                params.value + " MHz",
            },
            {
              field: "max_frec",
              width: 120,
              headerName: "Max Frec",
              type: "number",
              valueFormatter: (params: ValueFormatterParams) =>
                params.value + " MHz",
            },
            { field: "ram_version", width: 150, headerName: "RAM version" },
            { field: "model_size", width: 150, headerName: "Model Size" },
            { field: "video_socket", width: 150, headerName: "Video Socket" },
            {
              field: "edit",
              headerName: "Edit options",
              sortable: false,
              filterable: false,
              width: 300,
              renderCell: (params: GridCellParams) => (
                <ButtonGroup>
                  <Button
                    to={"edit/motherboard/" + params.row.id}
                    component={RouterLink}
                  >
                    Edit motherboard
                  </Button>
                  <Button onClick={() => handleDelete(params.row.id as string)}>
                    Delete
                  </Button>
                </ButtonGroup>
              ),
            },
          ] as GridColDef[]
        }
        rows={rows.map((motherboard: IMotherboard) => ({
          id: motherboard.id,
          product_id: motherboard.product?.id,
          name: motherboard.product?.name,
          description: motherboard.product?.description,
          stock: motherboard.product?.stock ? "Yes" : "No",
          price: motherboard.product!.price,
          brand: motherboard.product?.brand || "Not found",
          cpu_brand: motherboard.cpu_brand,
          cpu_socket: motherboard.cpu_socket,
          min_frec: motherboard.min_frec,
          max_frec: motherboard.max_frec,
          model_size: motherboard.model_size,
          ram_version: motherboard.ram_version,
          video_socket: motherboard.video_socket,
        }))}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default MotherboardTable;
