import { Box, Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import CabinetTable from "../Tables/CabinetTable";
import TableLayout from "../Tables/TableLayout";
import SnackbarAlert from "../SnackbarAlert";
import useGetAll from "src/hooks/useGetAll";
import { ICabinet } from "src/types";
import useDelete from "src/hooks/useDelete";
import { IGetCabinets } from "src/hooks/types";

const CabinetContainer = () => {
  const [deleteId, setDeleteId] = useState<string>("");
  const queryCabinet = useGetAll<IGetCabinets>("cabinet");
  const deleteCabinet = useDelete<ICabinet>("cabinet");
  const [open, setOpen] = useState(false);

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteCabinet.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteCabinet.isSuccess ? (
        <SnackbarAlert
          severity="success"
          text="Cabinet deleted successfully"
        ></SnackbarAlert>
      ) : (
        deleteCabinet.isError && (
          <SnackbarAlert
            severity="error"
            text="Something went wrong"
          ></SnackbarAlert>
        )
      )}
      <Box mb={1}>
        <Button
          to="create/cabinet"
          component={RouterLink}
          variant="outlined"
          endIcon={<AddCircleOutlineIcon />}
        >
          Add new cabinet
        </Button>
      </Box>

      <DeleteDialog
        toDelete="cabinet"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <TableLayout
        Table={CabinetTable}
        isError={queryCabinet.isError}
        isLoading={queryCabinet.isLoading}
        isSuccess={queryCabinet.isSuccess}
        handleDelete={handleClickDeleteBtn}
        rows={queryCabinet.data?.results}
      />
    </>
  );
};

export default CabinetContainer;
