import { Box, Button, ButtonGroup } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import { Link as RouterLink } from "react-router-dom";
import { ICategory } from "src/types";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import CustomToolbar from "../CustomToolbar";

interface Props {
  rows: ICategory[];
  handleDelete: (id: string) => void;
}

const CategoryTable = ({ rows, handleDelete }: Props) => {
  return (
    <Box height="500px" marginBottom="50px">
      <DataGrid
        columns={
          [
            { field: "id", type: "number", headerName: "ID", hide: true },
            { field: "name", width: 250, headerName: "Category name" },
            {
              field: "Edit options",
              sortable: false,
              filterable: false,
              width: 300,
              renderCell: (params: GridCellParams) => (
                <ButtonGroup>
                  <Button to={"categories/edit/" + params.row.id} component={RouterLink}>
                    Edit category
                  </Button>
                  <Button onClick={() => handleDelete(params.row.id as string)}>Delete</Button>
                </ButtonGroup>
              ),
            },
          ] as GridColDef[]
        }
        rows={rows.map((category: ICategory) => ({
          id: category.id,
          name: category.name,
        }))}
        components={{
          Toolbar: CustomToolbar,
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
      />
    </Box>
  );
};

export default CategoryTable;
