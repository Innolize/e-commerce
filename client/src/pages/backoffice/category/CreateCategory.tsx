import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SnackbarAlert from "src/components/SnackbarAlert";
import useCreate from "src/hooks/useCreate";
import { ICategory } from "src/types";
import { createCategorySchema } from "src/utils/yup.validations";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    maxWidth: "345px",
    marginTop: theme.spacing(10),
  },
  errorMsg: {
    color: "#f44336",
    fontSize: "0.75rem",
    textAlign: "start",
  },
}));

const CreateCategory = () => {
  const createCategory = useCreate<ICategory>("category");
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (createCategory.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [createCategory.isSuccess]);

  return (
    <Container>
      {createCategory.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Category created successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      <Box className={classes.formContainer}>
        <Formik
          initialValues={{ name: "" }}
          onSubmit={async (data) => {
            const formData = new FormData();
            formData.append("name", data.name);
            createCategory.mutate(formData);
          }}
          validationSchema={createCategorySchema}
        >
          {() => (
            <Form className={classes.form} encType="multipart/form-data">
              <Typography variant="h4">Create a new category</Typography>
              <Box mb={3}>
                <InputField label="Name" placeholder="Name" name="name" />
              </Box>

              {createCategory.isError && (
                <Box my={2}>
                  <Alert severity="error">{createCategory.error?.message || "Something went wrong."}</Alert>
                </Box>
              )}

              {redirect && <Navigate to="/admin/categories" />}

              <Box my={3}>
                {createCategory.isLoading ? (
                  <LoadingButton isSubmitting name="Submiting..." />
                ) : createCategory.isSuccess ? (
                  <LoadingButton isSuccess name="Submited" />
                ) : (
                  <LoadingButton name="Submit" />
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default CreateCategory;
