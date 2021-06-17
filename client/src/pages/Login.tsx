import { Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import FormWrapper from "src/components/FormWrapper";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import { UserContext } from "src/contexts/UserContext";
import useLoginUser from "src/hooks/loginUser";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

const loginSchema = yup.object({
  mail: yup.string().required("Email is required."),
  password: yup.string().required("Password is required."),
});

interface ILocationState {
  from: string;
}

const Login = () => {
  const { user } = useContext(UserContext);
  const classes = useStyles();
  const loginUser = useLoginUser();
  const { state } = useLocation<ILocationState>();

  if (user) {
    return <Redirect to={state?.from || "/"} />;
  }

  return (
    <Container>
      <FormWrapper title="Sign in">
        <Formik
          initialValues={{ mail: "", password: "" }}
          onSubmit={(data) => {
            loginUser.mutate(data);
          }}
          validationSchema={loginSchema}
        >
          {() => (
            <Form className={classes.form}>
              <InputField label="Email" placeholder="Email" name="mail" />
              <InputField type="password" label="Password" placeholder="Password" name="password" />

              <Box>
                {loginUser.isLoading ? (
                  <LoadingButton isSubmitting name="Loading..." />
                ) : loginUser.isSuccess ? (
                  <LoadingButton isSuccess name="Logged in" />
                ) : (
                  <LoadingButton name="Login" />
                )}
              </Box>

              {loginUser.isError && (
                <Box my={2}>
                  <Alert severity="error">Wrong email or password. Please try again.</Alert>
                </Box>
              )}
            </Form>
          )}
        </Formik>
      </FormWrapper>
    </Container>
  );
};

export default Login;
