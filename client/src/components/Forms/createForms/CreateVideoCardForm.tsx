import {
  Box,
  Checkbox,
  Container,
  Input,
  makeStyles,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SelectField from "src/components/SelectField";
import SnackbarAlert from "src/components/SnackbarAlert";
import { IProductForm, IVideoCardForm } from "src/form_types";
import useBrands from "src/hooks/brandHooks/useBrands";
import useCreateVideoCard from "src/hooks/productHooks/videoCard/useCreateVideoCard";
import { IBrand, VIDEO_CARD_VERSION } from "src/types";
import { VIDEO_CARD_ID } from "src/utils/categoriesIds";
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

const VideoCardForm = () => {
  const classes = useStyles();
  const createVideoCard = useCreateVideoCard();
  const queryBrands = useBrands();
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

  return (
    <Container>
      {createVideoCard.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Video card created successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      <Box className={classes.formContainer}>
        <Formik
          initialValues={{
            name: "",
            image: "",
            description: "",
            price: "",
            stock: "true",
            category: VIDEO_CARD_ID.toString(),
            brand: "",
            version: "",
            clock_speed: "",
            memory: "",
            watts: "",
          }}
          onSubmit={(data: IProductForm & IVideoCardForm) => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("stock", data.stock);
            formData.append("id_brand", data.brand);
            formData.append("id_category", data.category);
            formData.append("product_image", data.image);
            formData.append("memory", data.memory);
            formData.append("clock_speed", data.clock_speed);
            formData.append("version", data.version);
            formData.append("watts", data.watts);
            createVideoCard.mutate(formData);
          }}
          validationSchema={videoCardSchema}
        >
          {({ setFieldValue }) => (
            <Form className={classes.form} encType="multipart/form-data">
              <Typography variant="h4">Create a video card</Typography>
              <Box>
                <InputField label="Name" placeholder="Name" name="name" />
              </Box>
              <Box>
                <InputField
                  label="Description"
                  placeholder="Description"
                  name="description"
                />
              </Box>
              <Box>
                <InputField
                  type="number"
                  label="Price"
                  placeholder="Price"
                  name="price"
                />
              </Box>

              {queryBrands.isSuccess && (
                <SelectField name="brand" label="Brand">
                  {queryBrands.data.map((brand: IBrand) => (
                    <MenuItem key={uuidv4()} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </SelectField>
              )}

              <Field hidden name="category" label="Category"></Field>

              <Box>
                <InputField
                  type="number"
                  label="Clock Speed (MHz)"
                  placeholder="Clock Speed (MHz)"
                  name="clock_speed"
                />
              </Box>

              <Box>
                <InputField
                  type="number"
                  label="Memory (GB)"
                  placeholder="Memory (GB)"
                  name="memory"
                />
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
                <InputField
                  type="number"
                  label="Watts"
                  placeholder="Watts"
                  name="watts"
                />
              </Box>

              <Box display="flex" alignItems="center">
                <Typography>Stock:</Typography>
                <Field type="checkbox" name="stock" as={Checkbox} />
                <ErrorMessage
                  component={Typography}
                  className={classes.errorMsg}
                  name="stock"
                />
              </Box>

              <Box my={3}>
                <Input
                  type="file"
                  placeholder="Image"
                  name="image"
                  fullWidth
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("image", e.target.files![0])
                  }
                />
                <ErrorMessage
                  component={Typography}
                  className={classes.errorMsg}
                  name="image"
                />
              </Box>

              {createVideoCard.isError && (
                <Box my={2}>
                  <Alert severity="error">
                    {createVideoCard.error?.message}
                  </Alert>
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
    </Container>
  );
};

export default VideoCardForm;
