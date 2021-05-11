import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles((theme) => ({
  submitBtn: {
    margin: theme.spacing(3, 0, 2),
    width: "100%",
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-7px",
    marginLeft: "-12px",
  },
  buttonCheck: {
    color: theme.palette.secondary.main,
    position: "absolute",
    top: "50%",
    left: "75%",
    marginTop: "-8px",
    marginLeft: "-12px",
  },
  btnWrapper: {
    margin: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    position: "relative",
  },
}));

interface LoadingButtonProps {
  isSubmitting?: boolean;
  isSuccess?: boolean;
  name: string;
}

const LoadingButton = ({
  isSubmitting,
  isSuccess,
  name,
}: LoadingButtonProps) => {
  const classes = useStyles();

  return (
    <div className={classes.btnWrapper}>
      <Button
        className={classes.submitBtn}
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting || isSuccess}
      >
        {name}
      </Button>
      {isSubmitting && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
      {isSuccess && <CheckIcon className={classes.buttonCheck} />}
    </div>
  );
};

export default LoadingButton;
