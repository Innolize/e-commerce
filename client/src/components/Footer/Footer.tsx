import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import { Box, Divider } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.primary.main,
  },
  divider: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    width: '100%',
    height: '1px',
    margin: '10px 0',
  },
}));

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <Link to="/">Compra Gamer</Link> {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Typography variant="body1" component={Box}>
          <Box textAlign="center">Home</Box>
        </Typography>
        <Typography variant="body1" component={Box}>
          <Box textAlign="center">Products</Box>
        </Typography>
        <Typography variant="body1" component={Box}>
          <Box textAlign="center">Build your pc</Box>
        </Typography>

        <Divider className={classes.divider} />
        <GitHubIcon />
        <Copyright />
      </Container>
    </footer>
  );
};

export default Footer;
