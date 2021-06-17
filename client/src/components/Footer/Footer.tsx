import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { Box, Divider, IconButton } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    boxShadow:
      "0px -2px 4px -1px rgb(0 0 0 / 20%), 0px -4px 5px 0px rgb(0 0 0 / 14%), 0px -1px 10px 0px rgb(0 0 0 / 12%)",
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor: theme.palette.primary.main,
  },
  divider: {
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    width: "100%",
    height: "1px",
    margin: "10px 0",
  },
  flex: {
    display: "flex",
  },
}));

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      <Link color="textPrimary" component={RouterLink} to="/">
        Master Tech
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Typography className={classes.flex} variant="body1" component={Box}>
          <Box ml={2}>
            <Link color="textPrimary" component={RouterLink} to="/">
              Home
            </Link>
          </Box>

          <Box ml={2}>
            <Link color="textPrimary" component={RouterLink} to="/products">
              Products
            </Link>
          </Box>

          <Box ml={2}>
            <Link color="textPrimary" to="/build" component={RouterLink}>
              Build your pc
            </Link>
          </Box>
        </Typography>
        <Divider className={classes.divider} />
        <Box textAlign="center">
          <Link color="textPrimary" href="https://github.com/Innolize/e-commerce" target="_blank" rel="noreferrer">
            <IconButton color="inherit">
              <GitHubIcon />
            </IconButton>
          </Link>
        </Box>
        <Box textAlign="center">
          <Copyright />
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;
