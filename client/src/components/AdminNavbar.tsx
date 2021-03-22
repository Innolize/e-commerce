import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topBar: {
      backgroundColor: theme.palette.primary.dark,
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
      backgroundColor: theme.palette.primary.main,
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

const AdminNavbar = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Toolbar className={classes.bottomBar}>
      <Container className={classes.container} maxWidth="lg">
        <Tabs className={classes.tabs} value={value} onChange={handleChange}>
          <Tab label="Dashboard" to="/admin" component={RouterLink} />
          <Tab label="Products" to="/admin/products" component={RouterLink} />
          <Tab label="Categories" to="/admin/categories" component={RouterLink} />
          <Tab label="Brands" to="/admin/brands" component={RouterLink} />
        </Tabs>
        <Link className={classes.link} component={RouterLink} to="/">
          Go back to users page
        </Link>
      </Container>
    </Toolbar>
  );
};

export default AdminNavbar;
