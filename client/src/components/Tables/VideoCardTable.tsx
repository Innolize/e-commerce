import { Box, Button } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
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
              width: 120,
              headerName: "Price",
            },
            { field: "stock", width: 100, headerName: "Stock" },
            { field: "brand", width: 100, headerName: "Brand" },
            { field: "memory", width: 150, headerName: "Memory" },
            { field: "version", width: 150, headerName: "Version" },
            { field: "clock_speed", width: 150, headerName: "Clock Speed" },
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
        rows={rows.map((videoCard: IVideoCard) => ({
          id: videoCard.id,
          product_id: videoCard.product?.id,
          name: videoCard.product?.name,
          description: videoCard.product?.description,
          stock: videoCard.product?.stock ? "Yes" : "No",
          price: currencyFormatter.format(videoCard.product!.price),
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
