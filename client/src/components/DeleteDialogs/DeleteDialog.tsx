import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deleteButton: {
      backgroundColor: theme.palette.error.main,
      "&:hover": {
        backgroundColor: theme.palette.error.main,
      },
    },
  })
);

interface Props {
  closeDialog: () => void;
  handleDelete: () => void;
  open: boolean;
  toDelete: "brand" | "category" | "product";
}

const DeleteDialog = ({ open, closeDialog, handleDelete, toDelete }: Props) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>Do you want to delete this {toDelete} ?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          When you delete it, the {toDelete} will be lost. You still want to
          delete it?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} variant="contained" color="default">
          No, go back
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          className={classes.deleteButton}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
