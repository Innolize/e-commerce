import * as React from 'react';
import * as yup from 'yup';
import { Formik, Field, Form } from 'formik';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Divider } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: '3px',
    boxShadow: '0px 0px 15px 3px rgba(0,0,0,0.65);',
    marginTop: theme.spacing(9),
    marginBottom: theme.spacing(8),
    width: '90%',
  },
  paper: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  divider: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    width: '100%',
    height: '2px',
    margin: '10px 0',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: '100%',
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-7px',
    marginLeft: '-12px',
  },
  wrapper: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
}));

const loginSchema = yup.object({
  username: yup.string().required('Username is required.'),
  password: yup.string().required('Password is required.'),
});

function Login() {
  const classes = useStyles();

  const loginUser = () => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Sign in
        </Typography>
        <Divider className={classes.divider} />
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={async (data) => {
            await loginUser();
            console.log(data);
          }}
          validationSchema={loginSchema}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className={classes.form}>
              <Field
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Username"
                name="username"
                type="input"
                label="Username"
                as={TextField}
                color="secondary"
                helperText={errors.username && touched.username ? errors.username : ''}
                error={errors.username && touched.username ? true : false}
                required
              />
              <Field
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Password"
                name="password"
                type="password"
                label="Password"
                color="secondary"
                as={TextField}
                helperText={errors.password && touched.password ? errors.password : ''}
                error={errors.password && touched.password ? true : false}
                required
              />
              <div className={classes.wrapper}>
                <Button
                  className={classes.submit}
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting}
                >
                  Login
                </Button>
                {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
}

export default Login;
