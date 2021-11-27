import { Box, CircularProgress, Container, makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SnackbarAlert from "src/components/SnackbarAlert";
import { IProcessorForm } from "src/form_types";
import useEdit from "src/hooks/useEdit";
import useGetById from "src/hooks/useGetById";
import { IProcessor } from "src/types";
import { processorSchema } from "src/utils/yup.pcPickerValidations";

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

const EditProcessorForm = ({ id }: Props) => {
  const classes = useStyles();
  const editProcessor = useEdit<IProcessor>("processor", id);
  const queryProcessor = useGetById<IProcessor>("processor", id);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (editProcessor.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [editProcessor.isSuccess]);

  const getInitialValues = (processor: IProcessor): IProcessorForm => {
    const processorInitialValues: IProcessorForm = {
      cores: processor.cores.toString(),
      frecuency: processor.frecuency.toString(),
      socket: processor.socket.toString(),
      watts: processor.watts.toString(),
    };
    return processorInitialValues;
  };

  return (
    <Container>
      {editProcessor.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Processor edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {queryProcessor.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the processor.
          </Typography>
        </Box>
      )}

      {queryProcessor.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {queryProcessor.isSuccess && (
        <Box className={classes.formContainer}>
          <Formik
            initialValues={getInitialValues(queryProcessor.data)}
            onSubmit={(data) => {
              const formData = new FormData();
              formData.append("socket", data.socket);
              formData.append("cores", data.cores);
              formData.append("frecuency", data.frecuency);
              formData.append("watts", data.watts);
              editProcessor.mutate(formData);
            }}
            validationSchema={processorSchema}
          >
            {() => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box mb={2}>
                  <Typography align="center" variant="h5">
                    Edit specifications of
                  </Typography>
                  <Typography align="center" variant="h5">
                    "{queryProcessor.data.product!.name}"
                  </Typography>
                </Box>

                <Box>
                  <InputField type="number" label="Frequency GHz" placeholder="Frequency GHz" name="frecuency" />
                </Box>

                <Box>
                  <InputField label="Socket" placeholder="Socket" name="socket" />
                </Box>

                <Box>
                  <InputField type="number" label="Cores" placeholder="Cores" name="cores" />
                </Box>

                <Box>
                  <InputField type="number" label="Watts" placeholder="Watts" name="watts" />
                </Box>

                {editProcessor.isError && (
                  <Box my={2}>
                    <Alert severity="error">{editProcessor.error?.message}</Alert>
                  </Box>
                )}

                {redirect && <Redirect to={`/admin/build/processor`} />}

                <Box my={3}>
                  {editProcessor.isLoading ? (
                    <LoadingButton isSubmitting name="Submiting..." />
                  ) : editProcessor.isSuccess ? (
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

export default EditProcessorForm;
