import { Formik, Form, ErrorMessage } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import InputField from "src/components/InputField";
import { Box, Button, Container, Input, Typography } from "@material-ui/core";
import React, { useState } from "react";
import useCreateBrand from "../../hooks/brandHooks/useCreateBrand";
import { Redirect } from "react-router-dom";
import { createBrandSchema } from "../../utils/yup.validations";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    maxWidth: "320px",
    marginTop: theme.spacing(10),
  },
  errorMsg: {
    color: "#f44336",
    fontSize: "0.75rem",
    textAlign: "start",
  },
}));

const CreateBrand = () => {
  const createBrand = useCreateBrand();
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);

  createBrand.isSuccess &&
    setTimeout(() => {
      setRedirect(true);
    }, 2500);

  return (
    <Container>
      {createBrand.isSuccess && (
        <Box my={2}>
          <Alert severity="success">
            Brand created successfully. You will be redirected soon...
          </Alert>
        </Box>
      )}
      <Box className={classes.formContainer}>
        <Formik
          initialValues={{ name: "", logo: "" }}
          onSubmit={async (data) => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("logo", data.logo);
            createBrand.mutate(formData);
          }}
          validationSchema={createBrandSchema}
        >
          {({ setFieldValue }) => (
            <Form className={classes.form} encType="multipart/form-data">
              <Typography variant="h4">Create a new Brand</Typography>
              <Box mb={3}>
                <InputField label="Name" placeholder="Name" name="name" />
              </Box>
              <Box my={3}>
                <Input
                  type="file"
                  placeholder="Logo"
                  name="logo"
                  fullWidth
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("logo", e.target.files![0])
                  }
                />
                <ErrorMessage
                  component={Typography}
                  className={classes.errorMsg}
                  name="logo"
                />
              </Box>
              {createBrand.isError && (
                <Box my={2}>
                  <Alert severity="error">{createBrand.error?.message}</Alert>
                </Box>
              )}

              {redirect && <Redirect to="/admin/brands" />}
              <Box my={3}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default CreateBrand;
