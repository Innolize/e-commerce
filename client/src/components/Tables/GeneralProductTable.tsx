import { Box, Button } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
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
    <Box height="500px" marginBottom="50px">
      <DataGrid
        columns={
          [
            { field: "id", type: "number", hide: true },
            { field: "Name", width: 200 },
            { field: "Description", width: 200 },
            { field: "Category", width: 150 },
            {
              field: "Price",
              width: 120,
            },
            { field: "Stock", width: 100 },
            { field: "Brand", width: 100 },
            {
              field: "Edit",
              sortable: false,
              filterable: false,
              width: 300,
              flex: 1,
              renderCell: (params: GridCellParams) => (
                <div>
                  <Button
                    to={"products/edit/" + params.row.id}
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
        rows={rows.map((product: IProduct) => ({
          id: product.id,
          Name: product.name,
          Description: product.description,
          Price: currencyFormatter.format(product.price),
          Stock: product.stock ? "Yes" : "No",
          Category: product.category?.name || "Not found",
          Brand: product.brand?.name || "Not found",
        }))}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default GeneralProductTable;
