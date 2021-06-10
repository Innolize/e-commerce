import { Box, Button, ButtonGroup } from "@material-ui/core";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  ValueFormatterParams,
} from "@material-ui/data-grid";
import { IVideoCard } from "src/types";
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from "react-router-dom";
import currencyFormatter from "src/utils/formatCurrency";

interface Props {
  rows: IVideoCard[];
  handleDelete: (id: string) => void;
}

const VideoCardTable = ({ rows, handleDelete }: Props) => {
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
            { field: "brand", width: 120, headerName: "Brand" },
            { field: "version", width: 120, headerName: "Version" },
            {
              field: "memory",
              width: 110,
              headerName: "Memory",
              type: "number",
              valueFormatter: (params: ValueFormatterParams) =>
                params.value + " GB",
            },
            {
              field: "clock_speed",
              width: 140,
              headerName: "Clock Speed",
              type: "number",
              valueFormatter: (params: ValueFormatterParams) =>
                params.value + " MHz",
            },
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
                  <Button to={"edit/" + params.row.id} component={RouterLink}>
                    Edit video card
                  </Button>
                  <Button onClick={() => handleDelete(params.row.id as string)}>
                    Delete
                  </Button>
                </ButtonGroup>
              ),
            },
          ] as GridColDef[]
        }
        rows={rows.map((videoCard: IVideoCard) => ({
          id: videoCard.id,
          product_id: videoCard.product?.id,
          name: videoCard.product?.name,
          description: videoCard.product?.description,
          stock: videoCard.product?.stock ? "Yes" : "No",
          price: videoCard.product!.price,
          brand: videoCard.product?.brand || "Not found",
          memory: videoCard.memory,
          version: videoCard.version,
          clock_speed: videoCard.clock_speed,
          watts: videoCard.watts,
        }))}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default VideoCardTable;
