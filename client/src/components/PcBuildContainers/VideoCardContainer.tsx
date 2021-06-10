import { Box, Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useDeleteVideoCards from "src/hooks/productHooks/videoCard/useDeleteVideoCard";
import useVideoCards from "src/hooks/productHooks/videoCard/useVideoCards";
import DeleteDialog from "../DeleteDialogs/DeleteDialog";
import TableLayout from "../Tables/TableLayout";
import VideoCardTable from "../Tables/VideoCardTable";
import SnackbarAlert from "../SnackbarAlert";

const VideoCardContainer = () => {
  const [deleteId, setDeleteId] = useState<string>("");
  const queryVideoCards = useVideoCards();
  const deleteVideoCard = useDeleteVideoCards();
  const [open, setOpen] = useState(false);

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteVideoCard.mutate(deleteId);
    closeDialog();
  };

  return (
    <>
      {deleteVideoCard.isSuccess ? (
        <SnackbarAlert
          severity="success"
          text="Video card deleted successfully"
        ></SnackbarAlert>
      ) : (
        deleteVideoCard.isError && (
          <SnackbarAlert
            severity="error"
            text="Something went wrong"
          ></SnackbarAlert>
        )
      )}
      <Box mb={1}>
        <Button
          to="create/video-card"
          component={RouterLink}
          variant="outlined"
          endIcon={<AddCircleOutlineIcon />}
        >
          Add new video card
        </Button>
      </Box>

      <DeleteDialog
        toDelete="video card"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <TableLayout
        Table={VideoCardTable}
        isError={queryVideoCards.isError}
        isLoading={queryVideoCards.isLoading}
        isSuccess={queryVideoCards.isSuccess}
        handleDelete={handleClickDeleteBtn}
        rows={queryVideoCards.data}
      />
    </>
  );
};

export default VideoCardContainer;
