import { Box, CircularProgress, Container, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SelectField from "src/components/SelectField";
import SnackbarAlert from "src/components/SnackbarAlert";
import { IVideoCardForm } from "src/form_types";
import useEdit from "src/hooks/useEdit";
import useGetById from "src/hooks/useGetById";
import { IVideoCard, VIDEO_CARD_VERSION } from "src/types";
import { videoCardSchema } from "src/utils/yup.pcPickerValidations";
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

const EditVideoCardForm = ({ id }: Props) => {
  const classes = useStyles();
  const createVideoCard = useEdit<IVideoCard>("video-card", id);
  const queryVideoCard = useGetById<IVideoCard>("video-card", id);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (createVideoCard.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [createVideoCard.isSuccess]);

  const getInitialValues = (videoCard: IVideoCard): IVideoCardForm => {
    const videoCardInitialValues: IVideoCardForm = {
      version: videoCard.version,
      memory: videoCard.memory.toString(),
      clock_speed: videoCard.clockSpeed.toString(),
      watts: videoCard.watts.toString(),
    };
    return videoCardInitialValues;
  };

  return (
    <Container>
      {createVideoCard.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Video card edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {queryVideoCard.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the video card.
          </Typography>
        </Box>
      )}

      {queryVideoCard.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {queryVideoCard.isSuccess && (
        <Box className={classes.formContainer}>
          <Formik
            initialValues={getInitialValues(queryVideoCard.data)}
            onSubmit={(data) => {
              const formData = new FormData();
              formData.append("memory", data.memory);
              formData.append("clock_speed", data.clock_speed);
              formData.append("version", data.version);
              formData.append("watts", data.watts);
              createVideoCard.mutate(formData);
            }}
            validationSchema={videoCardSchema}
          >
            {() => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box mb={2}>
                  <Typography align="center" variant="h5">
                    Edit specifications of
                  </Typography>
                  <Typography align="center" variant="h5">
                    "{queryVideoCard.data.product!.name}"
                  </Typography>
                </Box>

                <Box>
                  <InputField
                    type="number"
                    label="Clock Speed (MHz)"
                    placeholder="Clock Speed (MHz)"
                    name="clock_speed"
                  />
                </Box>

                <Box>
                  <InputField type="number" label="Memory (GB)" placeholder="Memory (GB)" name="memory" />
                </Box>

                <Box>
                  <SelectField label="Version" name="version">
                    {VIDEO_CARD_VERSION.map((version: string) => (
                      <MenuItem key={uuidv4()} value={version}>
                        {version}
                      </MenuItem>
                    ))}
                  </SelectField>
                </Box>

                <Box>
                  <InputField type="number" label="Watts" placeholder="Watts" name="watts" />
                </Box>

                {createVideoCard.isError && (
                  <Box my={2}>
                    <Alert severity="error">{createVideoCard.error?.message}</Alert>
                  </Box>
                )}

                {redirect && <Redirect to={`/admin/build/video-card`} />}

                <Box my={3}>
                  {createVideoCard.isLoading ? (
                    <LoadingButton isSubmitting name="Submiting..." />
                  ) : createVideoCard.isSuccess ? (
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

export default EditVideoCardForm;
