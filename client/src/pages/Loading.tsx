import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  boxLoader: {
    margin: "0px",
    width: "100%",
    height: "100vh",
    background: theme.palette.background.default,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "5px solid transparent",
    borderTop: "5px solid #121212",
    borderBottom: "5px solid #121212",
    position: "relative",
    animation: `$animationLoader 3s infinite linear`,
    "&:before": {
      content: "",
      position: "absolute",
      top: 0,
      left: 0,
      width: "10px",
      height: "10px",
      background: "#121212",
      borderRadius: "50%",
    },
    "&:after": {
      content: "",
      position: "absolute",
      bottom: 0,
      right: 0,
      width: "10px",
      height: "10px",
      background: "#121212",
      borderRadius: "50%",
    },
  },
  "@keyframes animationLoader": {
    "0%": {
      transform: "rotate(360deg)",
    },
    "100%": {
      transform: "rotate(0deg)",
    },
  },
}));

const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.boxLoader}>
      <div className={classes.loader}></div>
    </div>
  );
};

export default Loading;
