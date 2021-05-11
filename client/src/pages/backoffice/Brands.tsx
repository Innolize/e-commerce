import { Box, Button, Typography } from "@material-ui/core";
import useBrands from "../../hooks/brandHooks/useBrands";
import { Container } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import DeleteDialog from "../../components/DeleteDialogs/DeleteDialog";
import useDeleteBrand from "../../hooks/brandHooks/useDeleteBrand";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import BrandTable from "src/components/Tables/BrandTable";

const Brands = () => {
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

      {query.isError && <DataGrid error rows={[]} columns={[]} />}
      {query.isLoading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      )}
      {query.isSuccess && (
        <BrandTable rows={query.data} handleDelete={handleClickDeleteBtn} />
      )}
    </Container>
  );
};

export default Brands;
