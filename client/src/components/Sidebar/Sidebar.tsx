import { Box, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";
import HomeIcon from "@material-ui/icons/Home";
import ListAltIcon from "@material-ui/icons/ListAlt";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ShopTwoIcon from "@material-ui/icons/ShopTwo";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import React, { useContext } from "react";
import { ThemeContext } from "src/contexts/CustomThemeContext";
import { UserContext } from "src/contexts/UserContext";
import useLogoutUser from "src/hooks/useLogout";
import { isAdmin } from "src/utils/isAdmin";
import ListLink from "./ListLink";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: 250,
    },
    paper: {
      backgroundColor: theme.palette.primary.main,
    },
    sidebarHeader: {
      height: "64px",
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
    },
    link: {
      textDecoration: "none",
      color: theme.palette.text.primary,
    },
  })
);

interface Props {
  state: boolean;
  setState: (open: boolean) => void;
}

function Sidebar({ state, setState }: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const { currentTheme, setTheme } = useContext(ThemeContext);
  const logout = useLogoutUser();

  const handleLogout = () => {
    logout.mutate();
  };

  const handleThemeChange = () => {
    currentTheme === "light" ? setTheme!("dark") : setTheme!("light");
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const iOS = (process as any).browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor="right"
      open={state}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      classes={{
        paper: classes.paper,
      }}
    >
      <div role="presentation">
        <Typography component="div" className={classes.sidebarHeader}>
          <Box fontSize="h5.fontSize" textAlign="center">
            Master Tech
          </Box>
        </Typography>

        <Divider />

        <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} className={classes.list}>
          <ListLink label="Home" to="/" icon={<HomeIcon />} />
          <ListLink label="Products" to="/products" icon={<ListAltIcon />} />
          <ListLink label="Build your pc" to="/build" icon={<DesktopMacIcon />} />

          <Divider />

          {user ? (
            <React.Fragment>
              <ListItem onClick={handleLogout} button>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </ListItem>
              <ListLink label="My orders" to="/orders" icon={<ShopTwoIcon />} />
            </React.Fragment>
          ) : (
            <>
              <ListLink label="Login" to="/login" icon={<PersonIcon />} />
              <ListLink label="Register" to="/register" icon={<PersonAddIcon />} />
            </>
          )}

          <Divider />

          <ListItem onClick={handleThemeChange} button>
            <ListItemIcon>{theme.palette.type === "light" ? <WbSunnyIcon /> : <NightsStayIcon />}</ListItemIcon>
            <ListItemText>{theme.palette.type === "light" ? "Change to dark" : "Change to light"}</ListItemText>
          </ListItem>

          <Divider />

          {isAdmin(user) && <ListLink label="Admin panel" to="/admin" icon={<SupervisorAccountIcon />} />}
        </List>
      </div>
    </SwipeableDrawer>
  );
}

export default Sidebar;
