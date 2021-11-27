import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles((theme) => ({
  submitBtn: {
    margin: theme.spacing(3, 0, 2),
    width: "100%",
  },
  buttonProgress: {
    color: theme.palette.secondary.main,
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
  onClick?: () => void;
  size?: "large" | "medium" | "small";
}

const LoadingButton = ({ isSubmitting, isSuccess, name, onClick, size }: LoadingButtonProps) => {
  const classes = useStyles();

  if (isSuccess) {
    return (
      <div className={classes.btnWrapper}>
        <Button
          disabled
          className={classes.submitBtn}
          endIcon={<CheckIcon />}
          size={size}
          type="submit"
          variant="contained"
        >
          {name}
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.btnWrapper}>
      <Button
        onClick={onClick}
        size={size}
        className={classes.submitBtn}
        type="submit"
        variant="contained"
        color="secondary"
        disabled={isSubmitting || isSuccess}
      >
        {name}
      </Button>
      {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
};

export default LoadingButton;
