import { Formik, Form } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import InputField from "src/components/InputField";
import { Box, Button, Container, Typography } from "@material-ui/core";
import { useState } from "react";
import useCreateCategory from "../../hooks/categoryHooks/useCreateCategory";
import { Redirect } from "react-router-dom";
import { createCategorySchema } from "../../utils/yup.validations";
import Alert from "@material-ui/lab/Alert";

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
  const createCategory = useCreateCategory();
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);

  createCategory.isSuccess &&
    setTimeout(() => {
      setRedirect(true);
    }, 2500);

  return (
    <Container>
      {createCategory.isSuccess && (
        <Box my={2}>
          <Alert severity="success">
            Category created successfully. You will be redirected soon...
          </Alert>
        </Box>
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
          {({ setFieldValue }) => (
            <Form className={classes.form} encType="multipart/form-data">
              <Typography variant="h4">Create a new category</Typography>
              <Box mb={3}>
                <InputField label="Name" placeholder="Name" name="name" />
              </Box>
              {createCategory.isError && (
                <Box my={2}>
                  <Alert severity="error">
                    {createCategory.error?.message}
                  </Alert>
                </Box>
              )}

              {redirect && <Redirect to="/admin/categories" />}
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

export default CreateCategory;
