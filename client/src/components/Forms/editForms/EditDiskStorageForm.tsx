import { Box, CircularProgress, Container, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SelectField from "src/components/SelectField";
import SnackbarAlert from "src/components/SnackbarAlert";
import { IDiskStorageForm } from "src/form_types";
import useCreate from "src/hooks/useCreate";
import useGetById from "src/hooks/useGetById";
import { DISK_TYPE, IDiskStorage } from "src/types";
import { diskStorageSchema } from "src/utils/yup.pcPickerValidations";
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

const EditDiskStorageForm = ({ id }: Props) => {
  const classes = useStyles();
  const createDiskStorage = useCreate<IDiskStorage>("disk-storage");
  const queryDiskStorage = useGetById<IDiskStorage>("disk-storage", id);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (createDiskStorage.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [createDiskStorage.isSuccess]);

  const mapDiskStorage = (diskStorage: IDiskStorage): IDiskStorageForm => {
    const diskStorageForm: IDiskStorageForm = {
      total_storage: diskStorage.total_storage.toString(),
      type: diskStorage.type,
      mbs: diskStorage.mbs.toString(),
      watts: diskStorage.watts.toString(),
    };
    return diskStorageForm;
  };

  return (
    <Container>
      {createDiskStorage.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Disk storage edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {queryDiskStorage.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the disk storage.
          </Typography>
        </Box>
      )}

      {queryDiskStorage.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {queryDiskStorage.isSuccess && (
        <Box className={classes.formContainer}>
          <Formik
            initialValues={mapDiskStorage(queryDiskStorage.data)}
            onSubmit={(data) => {
              const formData = new FormData();
              formData.append("type", data.type);
              formData.append("mbs", data.mbs);
              formData.append("total_storage", data.total_storage);
              formData.append("watts", data.watts);
              createDiskStorage.mutate(formData);
            }}
            validationSchema={diskStorageSchema}
          >
            {() => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box mb={2}>
                  <Typography align="center" variant="h5">
                    Edit specifications of
                  </Typography>
                  <Typography align="center" variant="h5">
                    "{queryDiskStorage.data.product!.name}"
                  </Typography>
                </Box>

                <Box>
                  <InputField
                    label="Total Storage (GB)"
                    placeholder="Total Storage (GB)"
                    name="total_storage"
                    type="number"
                  />
                </Box>

                <Box>
                  <InputField type="number" label="MB/S" placeholder="MB/S" name="mbs" />
                </Box>

                <Box>
                  <SelectField label="Type" name="type">
                    {DISK_TYPE.map((disk: string) => (
                      <MenuItem key={uuidv4()} value={disk}>
                        {disk}
                      </MenuItem>
                    ))}
                  </SelectField>
                </Box>

                <Box>
                  <InputField type="number" label="Watts" placeholder="Watts" name="watts" />
                </Box>

                {createDiskStorage.isError && (
                  <Box my={2}>
                    <Alert severity="error">{createDiskStorage.error?.message}</Alert>
                  </Box>
                )}

                {redirect && <Redirect to={`/admin/build/disk-storage`} />}

                <Box my={3}>
                  {createDiskStorage.isLoading ? (
                    <LoadingButton isSubmitting name="Submiting..." />
                  ) : createDiskStorage.isSuccess ? (
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

export default EditDiskStorageForm;
