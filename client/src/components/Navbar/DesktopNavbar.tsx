import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';
import SearchBar from 'components/Navbar/SearchBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topBar: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.info.main : theme.palette.primary.dark,
    },
    link: {
      color: theme.palette.text.primary,
      margin: '0 10px',
      fontSize: '0.9rem',
    },
    linkIcon: {
      color: theme.palette.text.primary,
      margin: '0 10px',
      fontSize: '10px',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    bottomBar: {
      height: '50px',
      minHeight: '50px',
      backgroundColor: theme.palette.type === 'light' ? theme.palette.info.light : theme.palette.primary.main,
    },
    switchMargin: {
      marginLeft: 'auto',
    },
    tabs: {
      overflow: 'inherit',
    },
    container: {
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    nowrap: {
      whiteSpace: 'nowrap',
    },
  })
);

interface Props {
  handleThemeChange: () => void;
}

function DesktopNavbar({ handleThemeChange }: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AppBar color="default" position="static">
      <Toolbar className={classes.topBar}>
        <Container className={classes.container} maxWidth="lg">
          <Typography className={classes.nowrap} variant="h6">
            Compra Gamer
          </Typography>
          <SearchBar />
          <Box className={classes.nowrap}>
            <Link className={classes.link} component={RouterLink} to="/login">
              Login
            </Link>
            <Link className={classes.link} component={RouterLink} to="/register">
              Register
            </Link>
            <Link className={classes.linkIcon} component={RouterLink} to="/cart">
              <Badge badgeContent={2} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </Link>
          </Box>
        </Container>
      </Toolbar>

      <Toolbar className={classes.bottomBar}>
        <Container className={classes.container} maxWidth="lg">
          <Tabs className={classes.tabs} value={value} onChange={handleChange}>
            <Tab label="Home" to="/" component={RouterLink} />
            <Tab label="Products" to="/products" component={RouterLink} />
            <Tab label="Build your pc" to="/build" component={RouterLink} />
          </Tabs>
          <IconButton className={classes.switchMargin} onClick={handleThemeChange}>
            {theme.palette.type === 'light' ? <WbSunnyIcon /> : <NightsStayIcon />}
          </IconButton>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default DesktopNavbar;
