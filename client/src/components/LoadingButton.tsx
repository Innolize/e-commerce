import { Button, CircularProgress, makeStyles } from "@material-ui/core";

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
  btnWrapper: {
    margin: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    position: "relative",
  },
}));

interface LoadingButtonProps {
  isSubmitting: boolean;
  name: string;
}

const LoadingButton = ({ isSubmitting, name }: LoadingButtonProps) => {
  const classes = useStyles();

  return (
    <div className={classes.btnWrapper}>
      <Button
        className={classes.submitBtn}
        type="submit"
        variant="contained"
        color="secondary"
        disabled={isSubmitting}
      >
        {name}
      </Button>
      {isSubmitting && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};

export default LoadingButton;
