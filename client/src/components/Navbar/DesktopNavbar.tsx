import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Tab from "@material-ui/core/Tab";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import SearchBar from "./SearchBar";
import ChangeThemeButton from "../ChangeThemeButton";
import { Tabs } from "@material-ui/core";
import { UserContext } from "src/contexts/UserContext";
import { isAdmin } from "src/utils/isAdmin";
import useLogoutUser from "src/hooks/useLogout";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topBar: {
      backgroundColor: theme.palette.primary.dark,
    },
    link: {
      color: theme.palette.text.primary,
      margin: "0 10px",
      fontSize: "0.9rem",
    },
    linkIcon: {
      color: theme.palette.text.primary,
      margin: "0 10px",
      fontSize: "10px",
      "&:hover": {
        color: theme.palette.secondary.dark,
      },
    },
    bottomBar: {
      height: "50px",
      minHeight: "50px",
      backgroundColor: theme.palette.primary.main,
    },
    autoMarginLeft: {
      marginLeft: "auto",
    },
    tabs: {
      overflow: "inherit",
    },
    container: {
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    nowrap: {
      whiteSpace: "nowrap",
    },
    logo: {
      height: "50px",
      width: "50px",
    },
    tab: {
      "&:hover": {
        color: theme.palette.secondary.main,
      },
    },
  })
);

const DesktopNavbar = React.memo(() => {
  const { user } = useContext(UserContext);
  const classes = useStyles();
  const logout = useLogoutUser();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <AppBar color="default" position="static">
      <Toolbar className={classes.topBar}>
        <Container className={classes.container} maxWidth="lg">
          <Box display="flex" alignItems="center">
            <img src="/logo192.png" alt="logo" className={classes.logo} />
            <Box ml={2}>
              <Typography className={classes.nowrap} variant="h6">
                Master Tech
              </Typography>
            </Box>
          </Box>
          <SearchBar />
          <Box className={classes.nowrap}>
            {user ? (
              <Box>
                <Link onClick={handleLogout} className={classes.link} component="button">
                  Logout
                </Link>
                <Link className={classes.linkIcon} component={RouterLink} to="/cart">
                  <Badge badgeContent={2} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </Link>
              </Box>
            ) : (
              <>
                <Link className={classes.link} component={RouterLink} to="/login">
                  Login
                </Link>
                <Link className={classes.link} component={RouterLink} to="/register">
                  Register
                </Link>
              </>
            )}
          </Box>
        </Container>
      </Toolbar>

      <Toolbar className={classes.bottomBar}>
        <Container className={classes.container} maxWidth="lg">
          <Tabs value={false}>
            <Tab className={classes.tab} label="Home" to="/" component={RouterLink} />
            <Tab className={classes.tab} label="Products" to="/products" component={RouterLink} />
            <Tab className={classes.tab} label="Build your pc" to="/build" component={RouterLink} />
          </Tabs>
          <ChangeThemeButton className={classes.autoMarginLeft} />
          {isAdmin(user) && (
            <Link className={classes.link} component={RouterLink} to="/admin">
              Admin panel
            </Link>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
});

export default DesktopNavbar;
