import { Box, CircularProgress, Container, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SelectField from "src/components/SelectField";
import SnackbarAlert from "src/components/SnackbarAlert";
import { IRamForm } from "src/form_types";
import useEdit from "src/hooks/useEdit";
import useGetById from "src/hooks/useGetById";
import { IRam } from "src/types";
import { ramSchema } from "src/utils/yup.pcPickerValidations";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
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

const EditRamForm = ({ id }: Props) => {
  const classes = useStyles();
  const createRam = useEdit<IRam>("ram", id);
  const queryRam = useGetById<IRam>("ram", id);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (createRam.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [createRam.isSuccess]);

  const mapRam = (ram: IRam): IRamForm => {
    const ramForm: IRamForm = {
      ram_version: ram.ram_version,
      memory: ram.memory.toString(),
      min_frec: ram.min_frec.toString(),
      max_frec: ram.max_frec.toString(),
      watts: ram.watts.toString(),
    };

    return ramForm;
  };

  return (
    <Container>
      {createRam.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Ram edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {queryRam.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the ram.
          </Typography>
        </Box>
      )}

      {queryRam.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {queryRam.isSuccess && (
        <Container maxWidth="xs" className={classes.formContainer}>
          <Formik
            initialValues={mapRam(queryRam.data)}
            onSubmit={(data) => {
              const formData = new FormData();
              formData.append("memory", data.memory);
              formData.append("ram_version", data.ram_version);
              formData.append("min_frec", data.min_frec);
              formData.append("max_frec", data.max_frec);
              formData.append("watts", data.watts);
              createRam.mutate(formData);
            }}
            validationSchema={ramSchema}
          >
            {() => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box mb={2}>
                  <Typography align="center" variant="h5">
                    Edit specifications of
                  </Typography>
                  <Typography align="center" variant="h5">
                    "{queryRam.data.product!.name}"
                  </Typography>
                </Box>
                <Box>
                  <SelectField label="RAM Version" placeholder="RAM Version" name="ram_version">
                    <MenuItem value="DDR1">DDR1</MenuItem>
                    <MenuItem value="DDR2">DDR2</MenuItem>
                    <MenuItem value="DDR3">DDR3</MenuItem>
                    <MenuItem value="DDR4">DDR4</MenuItem>
                  </SelectField>
                </Box>

                <Box>
                  <InputField label="Max Frequency" placeholder="Max Frequency" name="max_frec" />
                </Box>

                <Box>
                  <InputField label="Min Frequency" placeholder="Min Frequency" name="min_frec" />
                </Box>

                <Box>
                  <InputField label="Memory" placeholder="Memory" name="memory" />
                </Box>

                <Box>
                  <InputField label="Watts" placeholder="Watts" name="watts" />
                </Box>

                {createRam.isError && (
                  <Box my={2}>
                    <Alert severity="error">{createRam.error?.message}</Alert>
                  </Box>
                )}

                {redirect && <Redirect to={`/admin/build/ram`} />}

                <Box my={3}>
                  {createRam.isLoading ? (
                    <LoadingButton isSubmitting name="Submiting..." />
                  ) : createRam.isSuccess ? (
                    <LoadingButton isSuccess name="Submited" />
                  ) : (
                    <LoadingButton name="Submit" />
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </Container>
      )}
    </Container>
  );
};

export default EditRamForm;
