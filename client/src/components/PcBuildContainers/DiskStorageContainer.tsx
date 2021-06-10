import { Box, Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useDeleteDiskStorage from "src/hooks/productHooks/diskStorage/useDeleteDiskStorage";
import useDiskStorage from "src/hooks/productHooks/diskStorage/useDiskStorage";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import DiskStorageTable from "../Tables/DiskStorageTable";
import TableLayout from "../Tables/TableLayout";
import SnackbarAlert from "../SnackbarAlert";

const DiskStorageContainer = () => {
  const [deleteId, setDeleteId] = useState<string>("");
  const queryDiskStorages = useDiskStorage();
  const deleteDiskStorage = useDeleteDiskStorage();
  const [open, setOpen] = useState(false);

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteDiskStorage.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteDiskStorage.isSuccess ? (
        <SnackbarAlert
          severity="success"
          text="Disk storage deleted successfully"
        ></SnackbarAlert>
      ) : (
        deleteDiskStorage.isError && (
          <SnackbarAlert
            severity="error"
            text="Something went wrong"
          ></SnackbarAlert>
        )
      )}

      <Box mb={1}>
        <Button
          to="create/disk-storage"
          component={RouterLink}
          variant="outlined"
          endIcon={<AddCircleOutlineIcon />}
        >
          Add new disk storage
        </Button>
      </Box>

      <DeleteDialog
        toDelete="disk storage"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <TableLayout
        Table={DiskStorageTable}
        isError={queryDiskStorages.isError}
        isLoading={queryDiskStorages.isLoading}
        isSuccess={queryDiskStorages.isSuccess}
        handleDelete={handleClickDeleteBtn}
        rows={queryDiskStorages.data}
      />
    </>
  );
};

export default DiskStorageContainer;
