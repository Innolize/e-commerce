import { Box, Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useDeleteRam from "src/hooks/productHooks/ram/useDeleteRam";
import useRams from "src/hooks/productHooks/ram/useRams";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import SnackbarAlert from "../SnackbarAlert";
import RamTable from "../Tables/RamTable";
import TableLayout from "../Tables/TableLayout";

const RamContainer = () => {
  const [deleteId, setDeleteId] = useState<string>("");
  const queryRams = useRams();
  const deleteRam = useDeleteRam();
  const [open, setOpen] = useState(false);

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteRam.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteRam.isSuccess ? (
        <SnackbarAlert
          severity="success"
          text="Ram deleted successfully"
        ></SnackbarAlert>
      ) : (
        deleteRam.isError && (
          <SnackbarAlert
            severity="error"
            text="Something went wrong"
          ></SnackbarAlert>
        )
      )}
      <Box mb={1}>
        <Button
          to="create/ram"
          component={RouterLink}
          variant="outlined"
          endIcon={<AddCircleOutlineIcon />}
        >
          Add new ram
        </Button>
      </Box>

      <DeleteDialog
        toDelete="ram"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <TableLayout
        Table={RamTable}
        isError={queryRams.isError}
        isLoading={queryRams.isLoading}
        isSuccess={queryRams.isSuccess}
        handleDelete={handleClickDeleteBtn}
        rows={queryRams.data}
      />
    </>
  );
};

export default RamContainer;
