import AppBar from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import SearchBar from "./SearchBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      backgroundColor: theme.palette.primary.main,
      display: "flex",
      justifyContent: "space-between",
    },
    linkIcon: {
      color: theme.palette.text.primary,
      margin: "0 10px",
      fontSize: "10px",
      "&:hover": {
        color: theme.palette.primary.dark,
      },
    },
  })
);

const DesktopNavbar = React.memo(() => {
  const classes = useStyles();
  const [state, setState] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    setState(open);
  };

  return (
    <>
      <AppBar color="default" position="static">
        <Toolbar className={classes.toolbar}>
          <Link className={classes.linkIcon} component={RouterLink} to="/cart">
            <Badge badgeContent={2} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </Link>
          <SearchBar />
          <IconButton onClick={toggleDrawer(true)} edge="start" color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Sidebar state={state} setState={setState} />
    </>
  );
});

export default DesktopNavbar;
