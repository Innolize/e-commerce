import { Box, CircularProgress, Container, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SelectField from "src/components/SelectField";
import SnackbarAlert from "src/components/SnackbarAlert";
import { IMotherboardForm } from "src/form_types";
import useEdit from "src/hooks/useEdit";
import useGetById from "src/hooks/useGetById";
import { IMotherboard, RAM_VERSION, SIZE, VIDEO_CARD_VERSION } from "src/types";
import { motherboardSchema } from "src/utils/yup.pcPickerValidations";
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

const EditMotherboardForm = ({ id }: Props) => {
  const classes = useStyles();
  const editMotherboard = useEdit<IMotherboard>("motherboard", id);
  const queryMotherboard = useGetById<IMotherboard>("motherboard", id);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (editMotherboard.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [editMotherboard.isSuccess]);

  const getInitialValues = (motherboard: IMotherboard): IMotherboardForm => {
    const motherboardInitialValues: IMotherboardForm = {
      cpu_socket: motherboard.cpuSocket,
      cpu_brand: motherboard.cpuBrand,
      ram_version: motherboard.ramVersion,
      min_frec: motherboard.minFrec.toString(),
      max_frec: motherboard.maxFrec.toString(),
      video_socket: motherboard.videoSocket,
      model_size: motherboard.modelSize,
      watts: motherboard.watts.toString(),
    };

    return motherboardInitialValues;
  };

  return (
    <Container>
      {editMotherboard.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Motherboard edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {queryMotherboard.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the motherboard.
          </Typography>
        </Box>
      )}

      {queryMotherboard.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {queryMotherboard.isSuccess && (
        <Box className={classes.formContainer}>
          <Formik
            initialValues={getInitialValues(queryMotherboard.data)}
            onSubmit={(data) => {
              const formData = new FormData();
              formData.append("cpu_socket", data.cpu_socket);
              formData.append("cpu_brand", data.cpu_brand);
              formData.append("ram_version", data.ram_version);
              formData.append("min_frec", data.min_frec);
              formData.append("max_frec", data.max_frec);
              formData.append("video_socket", data.video_socket);
              formData.append("model_size", data.model_size);
              formData.append("watts", data.watts);
              editMotherboard.mutate(formData);
            }}
            validationSchema={motherboardSchema}
          >
            {({ setFieldValue }) => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box mb={2}>
                  <Typography align="center" variant="h5">
                    Edit specifications of
                  </Typography>
                  <Typography align="center" variant="h5">
                    "{queryMotherboard.data.product!.name}"
                  </Typography>
                </Box>
                <Box>
                  <InputField label="CPU Socket" placeholder="CPU Socket" name="cpu_socket" />
                </Box>

                <Box>
                  <SelectField label="CPU Brand" placeholder="CPU Brand" name="cpu_brand">
                    <MenuItem value="INTEL">INTEL</MenuItem>
                    <MenuItem value="AMD">AMD</MenuItem>
                  </SelectField>
                </Box>

                <Box>
                  <SelectField label="RAM Version" placeholder="RAM Version" name="ram_version">
                    {RAM_VERSION.map((ram: string) => (
                      <MenuItem key={uuidv4()} value={ram}>
                        {ram}
                      </MenuItem>
                    ))}
                  </SelectField>
                </Box>

                <Box>
                  <InputField type="number" label="Max Frequency" placeholder="Max Frequency" name="max_frec" />
                </Box>

                <Box>
                  <InputField type="number" label="Min Frequency" placeholder="Min Frequency" name="min_frec" />
                </Box>

                <Box>
                  <SelectField label="Video Socket" placeholder="Video Socket" name="video_socket">
                    {VIDEO_CARD_VERSION.map((videoSocket: string) => (
                      <MenuItem key={uuidv4()} value={videoSocket}>
                        {videoSocket}
                      </MenuItem>
                    ))}
                  </SelectField>
                </Box>

                <Box>
                  <SelectField label="Model Size" placeholder="Model Size" name="model_size">
                    {SIZE.map((size: string) => (
                      <MenuItem key={uuidv4()} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </SelectField>
                </Box>

                <Box>
                  <InputField type="number" label="Watts" placeholder="Watts" name="watts" />
                </Box>

                {editMotherboard.isError && (
                  <Box my={2}>
                    <Alert severity="error">{editMotherboard.error?.message}</Alert>
                  </Box>
                )}

                {redirect && <Navigate to={`/admin/build/motherboard`} />}

                <Box my={3}>
                  {editMotherboard.isLoading ? (
                    <LoadingButton isSubmitting name="Submiting..." />
                  ) : editMotherboard.isSuccess ? (
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

export default EditMotherboardForm;
