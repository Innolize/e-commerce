import { Box, Button, ButtonGroup } from "@material-ui/core";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  ValueFormatterParams,
} from "@material-ui/data-grid";
import { Link as RouterLink } from "react-router-dom";
import { IProduct } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import CustomToolbar from "../CustomToolbar";

interface Props {
  rows: IProduct[];
  handleDelete: (id: string) => void;
}

const GeneralProductTable = ({ rows, handleDelete }: Props) => {
  return (
    <Box width="100%" height="500px" marginBottom="50px">
      <DataGrid
        columns={
          [
            { field: "id", type: "number", hide: true },
            { field: "name", width: 200, headerName: "Product name" },
            { field: "description", width: 200, headerName: "Description" },
            { field: "category", width: 150, headerName: "Category" },
            {
              field: "price",
              width: 140,
              headerName: "Price",
              headerAlign: "center",
              align: "left",
              type: "number",
              valueFormatter: (params: ValueFormatterParams) =>
                currencyFormatter.format(Number(params.value)),
            },
            { field: "stock", width: 100, headerName: "Stock" },
            { field: "brand", width: 100, headerName: "Brand" },
            {
              field: "Edit options",
              sortable: false,
              filterable: false,
              width: 300,
              flex: 1,
              renderCell: (params: GridCellParams) => (
                <ButtonGroup>
                  <Button
                    variant="outlined"
                    to={"products/edit/" + params.row.id}
                    component={RouterLink}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleDelete(params.row.id as string)}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              ),
            },
          ] as GridColDef[]
        }
        rows={rows.map((product: IProduct) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock ? "Yes" : "No",
          category: product.category?.name || "Not found",
          brand: product.brand?.name || "Not found",
        }))}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default GeneralProductTable;
