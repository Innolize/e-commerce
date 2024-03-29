import { Box, Checkbox, CircularProgress, Container, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingButton from "src/components/LoadingButton";
import SelectField from "src/components/SelectField";
import SnackbarAlert from "src/components/SnackbarAlert";
import { ICabinetForm } from "src/form_types";
import useEdit from "src/hooks/useEdit";
import useGetById from "src/hooks/useGetById";
import { ICabinet, SIZE } from "src/types";
import { cabinetSchema } from "src/utils/yup.pcPickerValidations";
import { v4 as uuidv4 } from "uuid";

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

interface Props {
  id: string;
}

const EditCabinetForm = ({ id }: Props) => {
  const classes = useStyles();
  const queryCabinet = useGetById<ICabinet>("cabinet", id);
  const editCabinet = useEdit<ICabinet>("cabinet", id);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (editCabinet.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [editCabinet.isSuccess]);

  const getInitialValues = (cabinet: ICabinet): ICabinetForm => {
    const cabinetInitialValues: ICabinetForm = {
      size: cabinet.size,
      generic_pws: cabinet.genericPws ? "true" : " false",
    };
    return cabinetInitialValues;
  };

  return (
    <Container>
      {editCabinet.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Cabinet edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {queryCabinet.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the cabinet.
          </Typography>
        </Box>
      )}

      {queryCabinet.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {queryCabinet.isSuccess && (
        <Box className={classes.formContainer}>
          <Formik
            initialValues={getInitialValues(queryCabinet.data)}
            onSubmit={(data) => {
              const formData = new FormData();
              formData.append("size", data.size);
              formData.append("generic_pws", data.generic_pws);
              editCabinet.mutate(formData);
            }}
            validationSchema={cabinetSchema}
          >
            {() => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box mb={2}>
                  <Typography align="center" variant="h5">
                    Edit specifications of
                  </Typography>
                  <Typography align="center" variant="h5">
                    "{queryCabinet.data.product!.name}"
                  </Typography>
                </Box>

                <Box>
                  <SelectField label="Size" name="size">
                    {SIZE.map((size: string) => (
                      <MenuItem key={uuidv4()} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </SelectField>
                </Box>

                <Box display="flex" alignItems="center">
                  <Typography>Generic PWS:</Typography>
                  <Field type="checkbox" name="generic_pws" as={Checkbox} />
                  <ErrorMessage component={Typography} className={classes.errorMsg} name="generic_pws" />
                </Box>

                {editCabinet.isError && (
                  <Box my={2}>
                    <Alert severity="error">{editCabinet.error?.message}</Alert>
                  </Box>
                )}

                {redirect && <Navigate to={`/admin/build/cabinet`} />}

                <Box my={3}>
                  {editCabinet.isLoading ? (
                    <LoadingButton isSubmitting name="Submiting..." />
                  ) : editCabinet.isSuccess ? (
                    <LoadingButton isSuccess name="Submited" />
                  ) : (
                    <LoadingButton name="Submit" />
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

export default EditCabinetForm;
