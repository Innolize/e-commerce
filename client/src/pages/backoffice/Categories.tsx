import { Box, Button, Container, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { DataGrid } from "@material-ui/data-grid";
import useCategories from "../../hooks/categoryHooks/useCategories";
import useDeleteCategory from "../../hooks/categoryHooks/useDeleteCategory";
import Alert from "@material-ui/lab/Alert";
import DeleteDialog from "../../components/DeleteDialogs/DeleteDialog";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import CategoryTable from "src/components/Tables/CategoryTable";

const Categories = () => {
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
          <Alert severity="success">Category deleted successfully.</Alert>
        </Box>
      )}

      {deleteCategory.isError && (
        <Box my={2}>
          <Alert severity="error">
            Something went wrong deleting that category.
          </Alert>
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

      {query.isError && <DataGrid error rows={[]} columns={[]} />}
      {query.isLoading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      )}
      {query.isSuccess && (
        <CategoryTable rows={query.data} handleDelete={handleClickDeleteBtn} />
      )}
    </Container>
  );
};

export default Categories;
