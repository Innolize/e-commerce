import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import FormWrapper from 'src/components/FormWrapper';
import InputField from 'src/components/InputField';
import LoadingButton from 'src/components/LoadingButton';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

const loginSchema = yup.object({
  username: yup.string().required('Username is required.'),
  password: yup.string().required('Password is required.'),
});

const Login = () => {
  const classes = useStyles();

  const loginUser = () => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <FormWrapper title="Sign in">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (data) => {
          await loginUser();
          console.log(data);
        }}
        validationSchema={loginSchema}
      >
        {({ isSubmitting }) => (
          <Form className={classes.form}>
            <InputField label="Username" placeholder="Username" name="username" />
            <InputField type="password" label="Password" placeholder="Password" name="password" />
            <LoadingButton name="Login" isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
};

export default Login;
