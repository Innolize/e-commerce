import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DeleteIcon from "@material-ui/icons/Delete";

interface Props {
  closeDialog: () => void;
  handleDelete: () => void;
  open: boolean;
  toDelete: "brand" | "category" | "product";
}

const DeleteDialog = ({ open, closeDialog, handleDelete, toDelete }: Props) => {
  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>Delete the {toDelete} ?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          When you delete it, the {toDelete} will be lost. You still want to
          delete it?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} variant="contained" color="secondary">
          No, go back
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
