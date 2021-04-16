import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: "3px",
    boxShadow: "0px 0px 15px 3px rgba(0,0,0,0.65);",
    marginTop: theme.spacing(9),
    marginBottom: theme.spacing(8),
    width: "90%",
  },
  paper: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  divider: {
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    width: "100%",
    height: "2px",
    margin: "10px 0",
  },
}));

interface FormWrapperProps {
  title: string;
  children: React.ReactNode;
}

const FormWrapper = ({ title, children }: FormWrapperProps) => {
  const classes = useStyles();
  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
        <Divider className={classes.divider} />
        {children}
      </div>
    </Container>
  );
};

export default FormWrapper;
