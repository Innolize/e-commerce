import { Box, Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import MotherboardTable from "../Tables/MotherboardTable";
import TableLayout from "../Tables/TableLayout";
import SnackbarAlert from "../SnackbarAlert";
import useGetAll from "src/hooks/useGetAll";
import { IGetMotherboards } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import { IMotherboard } from "src/types";

const MotherboardContainer = () => {
  const [deleteId, setDeleteId] = useState<string>("");
  const queryMotherboards = useGetAll<IGetMotherboards>("motherboard");
  const deleteMotherboard = useDelete<IMotherboard>("motherboard");
  const [open, setOpen] = useState(false);

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteMotherboard.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteMotherboard.isSuccess ? (
        <SnackbarAlert
          severity="success"
          text="Motherboard deleted successfully"
        ></SnackbarAlert>
      ) : (
        deleteMotherboard.isError && (
          <SnackbarAlert
            severity="error"
            text="Something went wrong"
          ></SnackbarAlert>
        )
      )}

      <Box mb={1}>
        <Button
          to="create/motherboard"
          component={RouterLink}
          variant="outlined"
          endIcon={<AddCircleOutlineIcon />}
        >
          Add new motherboard
        </Button>
      </Box>

      <DeleteDialog
        toDelete="motherboard"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <TableLayout
        Table={MotherboardTable}
        isError={queryMotherboards.isError}
        isLoading={queryMotherboards.isLoading}
        isSuccess={queryMotherboards.isSuccess}
        handleDelete={handleClickDeleteBtn}
        rows={queryMotherboards.data?.results}
      />
    </>
  );
};

export default MotherboardContainer;
