import * as React from 'react';
import { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Sidebar from 'components/Sidebar/Sidebar';
import SearchBar from 'components/Navbar/SearchBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.info.main : theme.palette.primary.dark,
      display: 'flex',
      justifyContent: 'space-between',
    },
    linkIcon: {
      color: theme.palette.text.primary,
      margin: '0 10px',
      fontSize: '10px',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
  })
);

interface Props {
  handleThemeChange: () => void;
}

function DesktopNavbar({ handleThemeChange }: Props) {
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
      <Sidebar handleThemeChange={handleThemeChange} state={state} setState={setState} />
    </>
  );
}

export default DesktopNavbar;
