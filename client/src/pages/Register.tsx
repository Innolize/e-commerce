import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import FormWrapper from "src/components/FormWrapper";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SnackbarAlert from "src/components/SnackbarAlert";
import { UserContext } from "src/contexts/UserContext";
import useCreateUser from "src/hooks/useCreateUser";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

const registerSchema = yup.object({
  mail: yup.string().email("Invalid email").required("Email is required."),
  password: yup.string().required("Password is required.").min(8, "Password must have at least 8 characters"),
  "confirm-password": yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
});

const Register = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const createUser = useCreateUser();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <FormWrapper title="Register">
      <Formik
        initialValues={{ mail: "", password: "", "confirm-password": "" }}
        onSubmit={(data) => {
          createUser.mutate(data);
        }}
        validationSchema={registerSchema}
      >
        {() => (
          <Form className={classes.form}>
            <InputField label="Email" placeholder="Email" name="mail" />
            <InputField type="password" label="Password" placeholder="Password" name="password" />
            <InputField
              type="password"
              label="Confirm Password"
              placeholder="Confirm password"
              name="confirm-password"
            />
            <Box>
              {createUser.isLoading ? (
                <LoadingButton isSubmitting name="Loading..." />
              ) : createUser.isSuccess ? (
                <LoadingButton isSuccess name="User created" />
              ) : (
                <LoadingButton name="Register" />
              )}
            </Box>

            {createUser.isError && (
              <Box my={2}>
                <Alert severity="error">Something went wrong. Please try again.</Alert>
              </Box>
            )}

            {createUser.isSuccess && (
              <SnackbarAlert
                severity="success"
                text="User created successfully. You will be redirected soon..."
              ></SnackbarAlert>
            )}
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
};

export default Register;
