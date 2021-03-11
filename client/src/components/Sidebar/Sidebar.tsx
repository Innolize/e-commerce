import * as React from 'react';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Box, Typography } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import ListLink from './ListLink';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: 250,
    },
    paper: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.info.light : theme.palette.primary.main,
    },
    sidebarHeader: {
      height: '64px',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
  })
);

type Props = {
  state: boolean;
  setState: (arg0: boolean) => void;
  handleThemeChange: () => void;
};

function Sidebar({ state, setState, handleThemeChange }: Props) {
  const classes = useStyles();
  const theme = useTheme();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
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
            Compra Gamer
          </Box>
        </Typography>

        <Divider />

        <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} className={classes.list}>
          <ListLink label="Home" to="/" icon={<HomeIcon />} />
          <ListLink label="Products" to="/products" icon={<ListAltIcon />} />
          <ListLink label="Build your pc" to="/build" icon={<DesktopMacIcon />} />

          <Divider />

          <ListLink label="Login" to="/login" icon={<PersonIcon />} />
          <ListLink label="Register" to="/register" icon={<PersonAddIcon />} />

          <Divider />

          <ListItem button onClick={handleThemeChange}>
            <ListItemIcon>
              {theme.palette.type === 'light' ? <WbSunnyIcon /> : <NightsStayIcon />}
            </ListItemIcon>
            <ListItemText>
              {theme.palette.type === 'light' ? 'Change to dark' : 'Change to light'}
            </ListItemText>
          </ListItem>
        </List>
      </div>
    </SwipeableDrawer>
  );
}

export default Sidebar;
