import { Box, Button, Container, Typography } from "@material-ui/core";
import useCategories from "../../hooks/categoryHooks/useCategories";
import useDeleteCategory from "../../hooks/categoryHooks/useDeleteCategory";
import DeleteDialog from "../../components/DeleteDialogs/DeleteDialog";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import CategoryTable from "src/components/Tables/CategoryTable";
import SnackbarAlert from "src/components/SnackbarAlert";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import TableLayout from "src/components/Tables/TableLayout";

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

      {deleteCategory.isSuccess ? (
        <SnackbarAlert
          severity="success"
          text="Category deleted successfully"
        ></SnackbarAlert>
      ) : (
        deleteCategory.isError && (
          <SnackbarAlert
            severity="error"
            text="Something went wrong"
          ></SnackbarAlert>
        )
      )}

      <DeleteDialog
        toDelete="category"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <Box mb={1}>
        <Button
          to="categories/create"
          component={RouterLink}
          variant="outlined"
          endIcon={<AddCircleOutlineIcon />}
        >
          Add new category
        </Button>
      </Box>

      <TableLayout
        isError={query.isError}
        isLoading={query.isLoading}
        isSuccess={query.isSuccess}
        handleDelete={handleClickDeleteBtn}
        Table={CategoryTable}
        rows={query.data}
      />
    </Container>
  );
};

export default Categories;
