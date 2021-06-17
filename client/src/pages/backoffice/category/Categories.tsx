import { Box, Button, Container, Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import DeleteDialog from "src/components/DeleteDialogs/DeleteDialog";
import SnackbarAlert from "src/components/SnackbarAlert";
import CategoryTable from "src/components/Tables/CategoryTable";
import TableLayout from "src/components/Tables/TableLayout";
import { IGetCategories } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { ICategory } from "src/types";

const Categories = () => {
  const query = useGetAll<IGetCategories>("category");
  const [deleteId, setDeleteId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const deleteCategory = useDelete<ICategory>("category");

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
        rows={query.data?.results}
      />
    </Container>
  );
};

export default Categories;
