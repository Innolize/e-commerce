import { Box, Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import PowerSupplyTable from "../Tables/PowerSupplyTable";
import TableLayout from "../Tables/TableLayout";
import SnackbarAlert from "../SnackbarAlert";
import useGetAll from "src/hooks/useGetAll";
import { IGetPowerSupplies } from "src/hooks/types";
import useDelete from "src/hooks/useDelete";
import { IPowerSupply } from "src/types";

const PowerSupplyContainer = () => {
  const [deleteId, setDeleteId] = useState<string>("");
  const queryPowerSupply = useGetAll<IGetPowerSupplies>("power-supply");
  const deletePowerSupply = useDelete<IPowerSupply>("power-supply");
  const [open, setOpen] = useState(false);

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deletePowerSupply.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deletePowerSupply.isSuccess ? (
        <SnackbarAlert
          severity="success"
          text="Power supply deleted successfully"
        ></SnackbarAlert>
      ) : (
        deletePowerSupply.isError && (
          <SnackbarAlert
            severity="error"
            text="Something went wrong"
          ></SnackbarAlert>
        )
      )}
      <Box mb={1}>
        <Button
          to="create/power-supply"
          component={RouterLink}
          variant="outlined"
          endIcon={<AddCircleOutlineIcon />}
        >
          Add new power supply
        </Button>
      </Box>

      <DeleteDialog
        toDelete="power supply"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <TableLayout
        Table={PowerSupplyTable}
        isError={queryPowerSupply.isError}
        isLoading={queryPowerSupply.isLoading}
        isSuccess={queryPowerSupply.isSuccess}
        handleDelete={handleClickDeleteBtn}
        rows={queryPowerSupply.data?.results}
      />
    </>
  );
};

export default PowerSupplyContainer;
