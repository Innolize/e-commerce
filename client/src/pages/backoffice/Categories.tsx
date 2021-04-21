import { Box, Button, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import { useState } from "react";
import CustomToolbar from "../../components/CustomToolbar";
import useCategories from "../../hooks/categoryHooks/useCategories";
import useDeleteCategory from "../../hooks/categoryHooks/useDeleteCategory";
import Alert from "@material-ui/lab/Alert";
import DeleteDialog from "../../components/DeleteDialogs/DeleteDialog";
import { Link as RouterLink } from "react-router-dom";
import CustomNoRowsOverlay from "src/components/CustomNoRowsOverlay";

const useStyles = makeStyles(() => ({
  gridContainer: {
    height: "500px",
    marginBottom: "50px",
  },
}));

const Categories = () => {
  const classes = useStyles();
  const query = useCategories();
  const [deleteId, setDeleteId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const deleteCategory = useDeleteCategory();

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const handleDelete = () => {
    deleteCategory.mutate(deleteId);
    closeDialog();
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Typography variant="h3">Categories</Typography>
      </Box>

      {deleteCategory.isSuccess && (
        <Box my={2}>
          <Alert severity="success">Brand deleted successfully</Alert>
        </Box>
      )}

      {deleteCategory.isError && (
        <Box my={2}>
          <Alert severity="error">{deleteCategory.error?.message}</Alert>
        </Box>
      )}

      <DeleteDialog
        toDelete="category"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <Button to="categories/create" component={RouterLink}>
        Add new
      </Button>

      <Box className={classes.gridContainer}>
        {query.isError ? (
          <DataGrid error rows={[]} columns={[]} />
        ) : (
          <DataGrid
            columns={
              [
                { field: "id", type: "number", width: 80 },
                { field: "name", flex: 1 },
                {
                  field: "actions",
                  sortable: false,
                  filterable: false,
                  flex: 1,
                  renderCell: (params: GridCellParams) => (
                    <div>
                      <Button
                        to={"categories/edit/" + params.row.id}
                        component={RouterLink}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() =>
                          handleClickDeleteBtn(params.row.id as string)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ] as GridColDef[]
            }
            rows={
              query.isLoading
                ? []
                : query.data!.map((category: any) => ({
                    id: category.id,
                    name: category.name,
                  }))
            }
            loading={query.isLoading}
            components={{
              Toolbar: CustomToolbar,
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
          />
        )}
      </Box>
    </Container>
  );
};

export default Categories;
