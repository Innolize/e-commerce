import AppBar from "@material-ui/core/AppBar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import ChangeThemeButton from "../ChangeThemeButton";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      marginLeft: "auto",
      "&:hover": {
        color: theme.palette.secondary.main,
      },
    },
    navbar: {
      height: "50px",
      minHeight: "50px",
      backgroundColor: theme.palette.primary.main,
    },
    tab: {
      "&:hover": {
        color: theme.palette.secondary.main,
      },
    },
  })
);

const AdminNavbar = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.navbar} position="static">
      <Tabs scrollButtons="on" value={false} variant="scrollable">
        <Tab className={classes.tab} label="pc build products" to="/admin/build/ram" component={RouterLink} />
        <Tab className={classes.tab} label="Products" to="/admin/products" component={RouterLink} />
        <Tab className={classes.tab} label="Categories" to="/admin/categories" component={RouterLink} />
        <Tab className={classes.tab} label="Brands" to="/admin/brands" component={RouterLink} />
        <Tab className={classes.link} label="Go back to user page" to="/" component={RouterLink} />
        <ChangeThemeButton />
      </Tabs>
    </AppBar>
  );
};

export default AdminNavbar;
