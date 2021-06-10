import {
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SnackbarAlert from "src/components/SnackbarAlert";
import useEditCategory from "src/hooks/categoryHooks/useEditCategory";
import useGetCategoryById from "src/hooks/categoryHooks/useGetCategoryById";
import { ICategory } from "src/types";
import { editCategorySchema } from "src/utils/yup.validations";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  form: {
    maxWidth: "320px",
  },
  image: {
    width: "300px",
    height: "150px",
  },
  noImage: {
    width: "300px",
    height: "150px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    color: "black",
  },
  errorMsg: {
    color: "#f44336",
    fontSize: "0.75rem",
    textAlign: "start",
  },
  hidden: {
    display: "none",
  },
}));

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const queryCategory = useGetCategoryById(id);
  const editCategory = useEditCategory();
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);

  editCategory.isSuccess &&
    setTimeout(() => {
      setRedirect(true);
    }, 2500);

  return (
    <Container>
      {queryCategory.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the category.
          </Typography>
        </Box>
      )}

      {queryCategory.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {editCategory.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Category edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {redirect && <Redirect to="/admin/categories" />}

      {queryCategory.isSuccess && (
        <Box className={classes.formContainer} my={10}>
          <Typography variant="h4">Edit the category</Typography>
          <Formik
            initialValues={{ name: queryCategory.data.name, id }}
            onSubmit={async (data: ICategory) => {
              const formData = new FormData();
              // If the form was not modified we dont submit
              if (data.name === queryCategory.data.name) {
                return;
              }
              formData.append("id", id);
              formData.append("name", data.name);
              editCategory.mutate(formData);
            }}
            validationSchema={editCategorySchema}
          >
            {() => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box display="flex" my={1}>
                  <InputField label="Name" placeholder="Name" name="name" />
                </Box>

                {editCategory.isError && (
                  <Box my={2}>
                    <Alert severity="error">
                      {editCategory.error?.message || "Something went wrong."}
                    </Alert>
                  </Box>
                )}

                <Box>
                  {editCategory.isLoading ? (
                    <LoadingButton isSubmitting name="Editing..." />
                  ) : editCategory.isSuccess ? (
                    <LoadingButton isSuccess name="Submited" />
                  ) : (
                    <LoadingButton name="Submit changes" />
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Container>
  );
};

export default EditCategory;
