import AppBar from "@material-ui/core/AppBar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import ChangeThemeButton from "./ChangeThemeButton";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      marginLeft: "auto",
      "&:hover": {
        color: "black",
      },
    },
    navbar: {
      height: "50px",
      minHeight: "50px",
      backgroundColor: theme.palette.primary.main,
    },
  })
);

const AdminNavbar = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.navbar} position="static">
      <Tabs scrollButtons="on" value={false} variant="scrollable">
        <Tab
          label="pc build products"
          to="/admin/build/ram"
          component={RouterLink}
        />
        <Tab label="Products" to="/admin/products" component={RouterLink} />
        <Tab label="Categories" to="/admin/categories" component={RouterLink} />
        <Tab label="Brands" to="/admin/brands" component={RouterLink} />

        <Tab
          className={classes.link}
          label="Go back to user page"
          to="/"
          component={RouterLink}
        />
        <ChangeThemeButton />
      </Tabs>
    </AppBar>
  );
};

export default AdminNavbar;
