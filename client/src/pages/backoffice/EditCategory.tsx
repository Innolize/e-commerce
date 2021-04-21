import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import InputField from "src/components/InputField";
import useEditCategory from "../../hooks/categoryHooks/useEditCategory";
import useGetCategoryById from "../../hooks/categoryHooks/useGetCategoryById";
import { ICategory } from "../../types";
import Alert from "@material-ui/lab/Alert";
import { editCategorySchema } from "../../utils/yup.validations";

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

const CreateCategory = () => {
  const { id } = useParams<{ id: string }>();
  const queryCategory = useGetCategoryById(id);
  const editCategory = useEditCategory();
  const classes = useStyles();

  return (
    <Container>
      {queryCategory.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            {queryCategory.error.message}
          </Typography>
        </Box>
      )}
      {queryCategory.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}
      {editCategory.isSuccess && (
        <Box my={2}>
          <Alert severity="success">Sucessfully edited!</Alert>
        </Box>
      )}

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
                      {editCategory.error?.message}
                    </Alert>
                  </Box>
                )}
                <Box my={3}>
                  <Button type="submit" variant="contained" color="primary">
                    Submit changes
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Container>
  );
};

export default CreateCategory;
