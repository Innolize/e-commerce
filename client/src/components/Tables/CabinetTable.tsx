import { Box, Button, ButtonGroup } from "@material-ui/core";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  ValueFormatterParams,
} from "@material-ui/data-grid";
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
            { field: "size", headerName: "Size" },
            { field: "generic_pws", width: 138, headerName: "Generic PWS" },
            {
              field: "edit",
              headerName: "Edit options",
              sortable: false,
              filterable: false,
              width: 300,
              renderCell: (params: GridCellParams) => (
                <ButtonGroup>
                  <Button
                    to={"edit/cabinet/" + params.row.id}
                    component={RouterLink}
                  >
                    Edit Cabinet
                  </Button>
                  <Button onClick={() => handleDelete(params.row.id as string)}>
                    Delete
                  </Button>
                </ButtonGroup>
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
          price: cabinet.product!.price,
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
