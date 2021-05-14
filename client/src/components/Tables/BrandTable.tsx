import { Box, Button } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import { Link as RouterLink } from "react-router-dom";
import { IBrand } from "src/types";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import CustomToolbar from "../CustomToolbar";

interface Props {
  rows: IBrand[];
  handleDelete: (id: string) => void;
}

const BrandTable = ({ rows, handleDelete }: Props) => {
  return (
    <Box height="500px" marginBottom="50px">
      <DataGrid
        columns={
          [
            { field: "id", type: "number", headerName: "ID" },
            { field: "name", width: 250, headerName: "Brand name" },
            {
              field: "Edit options",
              sortable: false,
              filterable: false,
              width: 250,
              flex: 1,
              renderCell: (params: GridCellParams) => (
                <Box>
                  <Button
                    to={"brands/edit/" + params.row.id}
                    component={RouterLink}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(params.row.id as string)}>
                    Delete
                  </Button>
                </Box>
              ),
            },
          ] as GridColDef[]
        }
        rows={rows.map((brand: IBrand) => ({
          id: brand.id,
          name: brand.name,
        }))}
        components={{
          Toolbar: CustomToolbar,
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
      />
    </Box>
  );
};

export default BrandTable;
