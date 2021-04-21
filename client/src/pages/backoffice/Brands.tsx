import { Box, Button, Typography } from "@material-ui/core";
import useBrands from "../../hooks/brandHooks/useBrands";
import { Container } from "@material-ui/core";
import { DataGrid, GridColDef, GridCellParams } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
import CustomToolbar from "../../components/CustomToolbar";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import DeleteDialog from "../../components/DeleteDialogs/DeleteDialog";
import { IBrand } from "../../types";
import useDeleteBrand from "../../hooks/brandHooks/useDeleteBrand";
import Alert from "@material-ui/lab/Alert";
import CustomNoRowsOverlay from "src/components/CustomNoRowsOverlay";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    height: "500px",
    marginBottom: "50px",
  },
}));

const Brands = () => {
  const classes = useStyles();
  const query = useBrands();
  const [deleteId, setDeleteId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const deleteBrand = useDeleteBrand();

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const handleDelete = () => {
    deleteBrand.mutate(deleteId);
    closeDialog();
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Typography variant="h3">Brands</Typography>
      </Box>

      {deleteBrand.isSuccess && (
        <Box my={2}>
          <Alert severity="success">Brand deleted successfully</Alert>
        </Box>
      )}

      {deleteBrand.isError && (
        <Box my={2}>
          <Alert severity="error">{deleteBrand.error?.message}</Alert>
        </Box>
      )}

      <DeleteDialog
        toDelete="brand"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <Button to="brands/create" component={RouterLink}>
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
                        to={"brands/edit/" + params.row.id}
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
                : query.data!.map((brand: IBrand) => ({
                    id: brand.id,
                    name: brand.name,
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

export default Brands;
