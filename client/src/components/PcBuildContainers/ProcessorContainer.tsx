import { Box, Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useDeleteProcessor from "src/hooks/productHooks/processor/useDeleteProcessor";
import useProcessors from "src/hooks/productHooks/processor/useProcessors";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import ProcessorTable from "../Tables/ProcessorTable";
import TableLayout from "../Tables/TableLayout";
import SnackbarAlert from "../SnackbarAlert";

const ProcessorContainer = () => {
  const [deleteId, setDeleteId] = useState<string>("");
  const queryProcessors = useProcessors();
  const deleteProcessor = useDeleteProcessor();
  const [open, setOpen] = useState(false);

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteProcessor.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteProcessor.isSuccess ? (
        <SnackbarAlert
          severity="success"
          text="Processor deleted successfully"
        ></SnackbarAlert>
      ) : (
        deleteProcessor.isError && (
          <SnackbarAlert
            severity="error"
            text="Something went wrong"
          ></SnackbarAlert>
        )
      )}
      <Box mb={1}>
        <Button
          to="create/processor"
          component={RouterLink}
          variant="outlined"
          endIcon={<AddCircleOutlineIcon />}
        >
          Add new processor
        </Button>
      </Box>

      <DeleteDialog
        toDelete="processor"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <TableLayout
        Table={ProcessorTable}
        isError={queryProcessors.isError}
        isLoading={queryProcessors.isLoading}
        isSuccess={queryProcessors.isSuccess}
        handleDelete={handleClickDeleteBtn}
        rows={queryProcessors.data}
      />
    </>
  );
};

export default ProcessorContainer;
