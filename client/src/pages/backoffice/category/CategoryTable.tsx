import { Box, Button, ButtonGroup, Container, Typography } from "@material-ui/core";
import { DataGrid, GridCellParams, GridColDef, GridPageChangeParams } from "@material-ui/data-grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import CustomNoRowsOverlay from "src/components/CustomNoRowsOverlay";
import CustomToolbar from "src/components/CustomToolbar";
import DeleteDialog from "src/components/DeleteDialogs/DeleteDialog";
import SnackbarAlert from "src/components/SnackbarAlert";
import { IGetCategories } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { ICategory } from "src/types";

const CategoryTable = () => {
  const PAGE_SIZE = 12;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const deleteCategory = useDelete<ICategory>("category");
  const queryCategories = useGetAll<IGetCategories>("category", offset, PAGE_SIZE);

  const handlePageChange = (params: GridPageChangeParams) => {
    setOffset(params.page * PAGE_SIZE);
  };

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
        <SnackbarAlert severity="success" text="Category deleted successfully"></SnackbarAlert>
      ) : (
        deleteCategory.isError && <SnackbarAlert severity="error" text="Something went wrong"></SnackbarAlert>
      )}

      <DeleteDialog toDelete="category" open={open} closeDialog={closeDialog} handleDelete={handleDelete} />

      <Box mb={1}>
        <Button to="categories/create" component={RouterLink} variant="outlined" endIcon={<AddCircleOutlineIcon />}>
          Add new category
        </Button>
      </Box>

      <Box height="500px" marginBottom="50px">
        <DataGrid
          pagination
          paginationMode="server"
          pageSize={PAGE_SIZE}
          rowCount={queryCategories.isSuccess ? queryCategories.data.count : undefined}
          onPageChange={handlePageChange}
          loading={queryCategories.isLoading}
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
                    <Button onClick={() => handleClickDeleteBtn(params.row.id as string)}>Delete</Button>
                  </ButtonGroup>
                ),
              },
            ] as GridColDef[]
          }
          rows={
            queryCategories.isSuccess
              ? queryCategories.data.results.map((category: ICategory) => ({
                  id: category.id,
                  name: category.name,
                }))
              : []
          }
          components={{
            Toolbar: CustomToolbar,
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
        />
      </Box>
    </Container>
  );
};

export default CategoryTable;
