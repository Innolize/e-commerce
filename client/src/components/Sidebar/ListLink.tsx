import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: "none",
      color: theme.palette.text.primary,
    },
  })
);

interface Props {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const ListLink = ({ to, label, icon }: Props) => {
  const classes = useStyles();

  return (
    <Link className={classes.link} to={to}>
      <ListItem button>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </ListItem>
    </Link>
  );
};

export default ListLink;
