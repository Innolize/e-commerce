import { Box, Button, Container, Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import SnackbarAlert from "src/components/SnackbarAlert";
import BrandTable from "src/components/Tables/BrandTable";
import TableLayout from "src/components/Tables/TableLayout";
import { IGetBrands } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import useGetAll from "src/hooks/useGetAll";
import { IBrand } from "src/types";
import DeleteDialog from "../../../components/DeleteDialogs/DeleteDialog";

const Brands = () => {
  const query = useGetAll<IGetBrands>("brand");
  const [deleteId, setDeleteId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const deleteBrand = useDelete<IBrand>("brand");

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
        rows={query.data?.results}
      />
    </Container>
  );
};

export default Brands;
