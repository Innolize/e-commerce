import { Snackbar } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

interface Props {
  text: string;
  severity: "success" | "info" | "warning" | "error";
}

const SnackbarAlert = ({ text, severity }: Props) => {
  const [openSnackbar, setOpenSnackbar] = useState(true);

  const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={openSnackbar}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
      TransitionComponent={SlideTransition}
    >
      <Alert variant="filled" onClose={handleSnackbarClose} severity={severity}>
        {text}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
