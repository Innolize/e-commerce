import { Box, CircularProgress, Container, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SelectField from "src/components/SelectField";
import SnackbarAlert from "src/components/SnackbarAlert";
import { IPowerSupplyForm } from "src/form_types";
import useEdit from "src/hooks/useEdit";
import useGetById from "src/hooks/useGetById";
import { IPowerSupply, PWS_CERTIFICATION } from "src/types";
import { powerSupplySchema } from "src/utils/yup.pcPickerValidations";

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

const EditPowerSupplyForm = ({ id }: Props) => {
  const classes = useStyles();
  const editPowerSupply = useEdit<IPowerSupply>("power-supply", id);
  const queryPowerSupply = useGetById<IPowerSupply>("power-supply", id);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (editPowerSupply.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [editPowerSupply.isSuccess]);

  const getInitialValues = (powerSupply: IPowerSupply): IPowerSupplyForm => {
    const powerSupplyInitialValues: IPowerSupplyForm = {
      certification: powerSupply.certification,
      watts: powerSupply.watts.toString(),
    };

    return powerSupplyInitialValues;
  };

  return (
    <Container>
      {editPowerSupply.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Power supply edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {queryPowerSupply.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the power supply.
          </Typography>
        </Box>
      )}

      {queryPowerSupply.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {queryPowerSupply.isSuccess && (
        <Box className={classes.formContainer}>
          <Formik
            initialValues={getInitialValues(queryPowerSupply.data)}
            onSubmit={(data) => {
              const formData = new FormData();
              formData.append("certification", data.certification);
              formData.append("watts", data.watts);
              editPowerSupply.mutate(formData);
            }}
            validationSchema={powerSupplySchema}
          >
            {() => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box mb={2}>
                  <Typography align="center" variant="h5">
                    Edit specifications of
                  </Typography>
                  <Typography align="center" variant="h5">
                    "{queryPowerSupply.data.product!.name}"
                  </Typography>
                </Box>

                <Box>
                  <SelectField label="Certification" name="certification">
                    {PWS_CERTIFICATION.map((certification: string) => (
                      <MenuItem value={certification}>{certification}</MenuItem>
                    ))}
                  </SelectField>
                </Box>

                <Box>
                  <InputField type="number" label="Watts" placeholder="Watts" name="watts" />
                </Box>

                {editPowerSupply.isError && (
                  <Box my={2}>
                    <Alert severity="error">{editPowerSupply.error?.message}</Alert>
                  </Box>
                )}

                {redirect && <Redirect to={`/admin/build/power-supply`} />}

                <Box my={3}>
                  {editPowerSupply.isLoading ? (
                    <LoadingButton isSubmitting name="Submiting..." />
                  ) : editPowerSupply.isSuccess ? (
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

export default EditPowerSupplyForm;
