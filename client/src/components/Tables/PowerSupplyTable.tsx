import { Box, Button, ButtonGroup } from "@material-ui/core";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  ValueFormatterParams,
} from "@material-ui/data-grid";
import { IPowerSupply } from "src/types";
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from "react-router-dom";
import currencyFormatter from "src/utils/formatCurrency";

interface Props {
  rows: IPowerSupply[];
  handleDelete: (id: string) => void;
}

const PowerSupplyTable = ({ rows, handleDelete }: Props) => {
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
            { field: "certification", width: 150, headerName: "Certification" },
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
                    Edit power supply
                  </Button>
                  <Button onClick={() => handleDelete(params.row.id as string)}>
                    Delete
                  </Button>
                </ButtonGroup>
              ),
            },
          ] as GridColDef[]
        }
        rows={rows.map((powerSupply: IPowerSupply) => ({
          id: powerSupply.id,
          product_id: powerSupply.product?.id,
          name: powerSupply.product?.name,
          description: powerSupply.product?.description,
          stock: powerSupply.product?.stock ? "Yes" : "No",
          price: powerSupply.product!.price,
          brand: powerSupply.product?.brand || "Not found",
          certification: powerSupply.certification,
          watts: powerSupply.watts,
        }))}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default PowerSupplyTable;
