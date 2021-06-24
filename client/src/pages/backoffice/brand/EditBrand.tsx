import { Box, CircularProgress, Container, Input, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { ErrorMessage, Form, Formik } from "formik";
import Image from "material-ui-image";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SnackbarAlert from "src/components/SnackbarAlert";
import useEdit from "src/hooks/useEdit";
import useGetById from "src/hooks/useGetById";
import { IBrand } from "src/types";
import { editBrandSchema } from "src/utils/yup.validations";

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

const EditBrand = () => {
  const { id } = useParams<{ id: string }>();
  const queryBrand = useGetById<IBrand>("brand", id);
  const editBrand = useEdit<IBrand>("brand");
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (editBrand.isSuccess) {
      timer = setTimeout(() => {
        history.replace("/admin/brands");
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [editBrand.isSuccess, history]);

  return (
    <Container>
      {queryBrand.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the brand.
          </Typography>
        </Box>
      )}

      {queryBrand.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {editBrand.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Brand edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {queryBrand.isSuccess && (
        <Box className={classes.formContainer} my={10}>
          <Typography variant="h4">Edit the brand</Typography>
          <Formik
            initialValues={{ name: queryBrand.data.name, logo: "", id }}
            onSubmit={async (data: IBrand) => {
              const formData = new FormData();

              // If the form was not modified we dont submit
              if (data.name === queryBrand.data.name && !data.logo) {
                return;
              }

              formData.append("id", id);
              formData.append("name", data.name);
              formData.append("brand_logo", data.logo);

              editBrand.mutate(formData);
            }}
            validationSchema={editBrandSchema}
          >
            {({ setFieldValue }) => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box display="flex" my={1}>
                  <InputField label="Name" placeholder="Name" name="name" />
                </Box>
                <Box display="flex" justifyContent="center">
                  <Paper className={classes.image}>
                    {queryBrand.data.logo ? (
                      <Image
                        disableTransition
                        imageStyle={{ borderRadius: "4px", height: "150px" }}
                        style={{
                          borderRadius: "4px",
                          paddingTop: "0",
                          height: "150px",
                        }}
                        src={queryBrand.data.logo}
                      />
                    ) : (
                      <Paper className={classes.noImage}>
                        <Typography>Image not found.</Typography>
                      </Paper>
                    )}
                  </Paper>
                </Box>
                <Box my={3}>
                  <Input
                    type="file"
                    placeholder="Logo"
                    name="logo"
                    color="secondary"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("logo", e.target.files![0])}
                  />
                  <ErrorMessage component={Typography} className={classes.errorMsg} name="logo" />
                </Box>
                {editBrand.isError && (
                  <Box my={2}>
                    <Alert severity="error">{editBrand.error?.message || "Something went wrong."}</Alert>
                  </Box>
                )}
                <Box>
                  {editBrand.isLoading ? (
                    <LoadingButton isSubmitting name="Editing..." />
                  ) : editBrand.isSuccess ? (
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

export default EditBrand;
