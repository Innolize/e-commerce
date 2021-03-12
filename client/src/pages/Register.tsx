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

const registerSchema = yup.object({
  username: yup.string().required('Username is required.'),
  password: yup.string().required('Password is required.').min(8, 'Password must have at least 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const Register = () => {
  const classes = useStyles();

  const registerUser = () => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <FormWrapper title="Register">
      <Formik
        initialValues={{ username: '', password: '', 'confirm-password': '' }}
        onSubmit={async (data) => {
          // Api call mock
          await registerUser();
          console.log(data);
        }}
        validationSchema={registerSchema}
      >
        {({ isSubmitting }) => (
          <Form className={classes.form}>
            <InputField label="Username" placeholder="Username" name="username" />
            <InputField type="password" label="Password" placeholder="Password" name="password" />
            <InputField
              type="password"
              label="Confirm Password"
              placeholder="Confirm password"
              name="confirm-password"
            />
            <LoadingButton name="Login" isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
};

export default Register;
