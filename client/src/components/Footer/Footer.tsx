import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { Box, Divider } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <Link color="inherit">Compra Gamer</Link> {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.type === 'light' ? theme.palette.info.main : theme.palette.primary.dark,
  },
  divider: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    width: '100%',
    height: '1px',
    margin: '10px 0',
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Typography variant="body1" component={Box}>
          <Box textAlign="center">Pages</Box>
        </Typography>
        <Typography variant="body1" component={Box}>
          <Box textAlign="center">Pages</Box>
        </Typography>

        <Divider className={classes.divider} />
        <GitHubIcon />
        <Copyright />
      </Container>
    </footer>
  );
};

export default Footer;
