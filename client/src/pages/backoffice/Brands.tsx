import { Box, Button, Typography } from "@material-ui/core";
import useBrands from "../../hooks/brandHooks/useBrands";
import { Container } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import DeleteDialog from "../../components/DeleteDialogs/DeleteDialog";
import useDeleteBrand from "../../hooks/brandHooks/useDeleteBrand";
import SnackbarAlert from "src/components/SnackbarAlert";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import TableLayout from "src/components/Tables/TableLayout";
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

      {deleteBrand.isSuccess ? (
        <SnackbarAlert
          severity="success"
          text="Brand deleted successfully"
        ></SnackbarAlert>
      ) : (
        deleteBrand.isError && (
          <SnackbarAlert
            severity="error"
            text="Something went wrong"
          ></SnackbarAlert>
        )
      )}

      <DeleteDialog
        toDelete="brand"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <Box mb={1}>
        <Button
          to="brands/create"
          component={RouterLink}
          variant="outlined"
          endIcon={<AddCircleOutlineIcon />}
        >
          Add new brand
        </Button>
      </Box>

      <TableLayout
        isError={query.isError}
        isLoading={query.isLoading}
        isSuccess={query.isSuccess}
        handleDelete={handleClickDeleteBtn}
        Table={BrandTable}
        rows={query.data}
      />
    </Container>
  );
};

export default Brands;
