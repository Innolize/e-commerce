import {
  Box,
  Checkbox,
  CircularProgress,
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
import { IMotherboardForm } from "src/form_types";
import { IGetBrands } from "src/hooks/types";
import useEdit from "src/hooks/useEdit";
import useGetAll from "src/hooks/useGetAll";
import useGetById from "src/hooks/useGetById";
import { IBrand, IMotherboard, RAM_VERSION, SIZE } from "src/types";
import { MOTHERBOARD_ID } from "src/utils/categoriesIds";
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
  const editMotherboard = useEdit<IMotherboard>("motherboard");
  const queryBrands = useGetAll<IGetBrands>("brand");
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

  const mapMotherboard = (motherboard: IMotherboard): IMotherboardForm => {
    const motherboardForm: IMotherboardForm = {
      id: motherboard.id.toString(),
      name: motherboard.product!.name,
      description: motherboard.product!.description,
      price: motherboard.product!.price.toString(),
      stock: motherboard.product!.stock.toString(),
      image: "",
      brand: motherboard.product!.brand.id.toString(),
      category: MOTHERBOARD_ID.toString(),
      cpu_socket: motherboard.cpu_socket,
      cpu_brand: motherboard.cpu_brand,
      ram_version: motherboard.ram_version,
      min_frec: motherboard.min_frec.toString(),
      max_frec: motherboard.max_frec.toString(),
      video_socket: motherboard.video_socket,
      model_size: motherboard.model_size,
      watts: motherboard.watts.toString(),
    };

    return motherboardForm;
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
            initialValues={mapMotherboard(queryMotherboard.data)}
            onSubmit={(data) => {
              const formData = new FormData();
              formData.append("name", data.name);
              formData.append("description", data.description);
              formData.append("price", data.price);
              formData.append("stock", data.stock);
              formData.append("id_brand", data.brand);
              formData.append("id_category", data.category);
              formData.append("product_image", data.image);
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
                <Typography variant="h4">Edit a Motherboard</Typography>
                <Box>
                  <InputField name="id" hidden />
                </Box>
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
                    {queryBrands.data.results.map((brand: IBrand) => (
                      <MenuItem key={uuidv4()} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </SelectField>
                )}

                <Field hidden name="category" label="Category"></Field>

                <Box>
                  <InputField
                    label="CPU Socket"
                    placeholder="CPU Socket"
                    name="cpu_socket"
                  />
                </Box>

                <Box>
                  <SelectField
                    label="CPU Brand"
                    placeholder="CPU Brand"
                    name="cpu_brand"
                  >
                    <MenuItem value="INTEL">INTEL</MenuItem>
                    <MenuItem value="AMD">AMD</MenuItem>
                  </SelectField>
                </Box>

                <Box>
                  <SelectField
                    label="RAM Version"
                    placeholder="RAM Version"
                    name="ram_version"
                  >
                    {RAM_VERSION.map((ram: string) => (
                      <MenuItem key={uuidv4()} value={ram}>
                        {ram}
                      </MenuItem>
                    ))}
                  </SelectField>
                </Box>

                <Box>
                  <InputField
                    type="number"
                    label="Max Frequency"
                    placeholder="Max Frequency"
                    name="max_frec"
                  />
                </Box>

                <Box>
                  <InputField
                    type="number"
                    label="Min Frequency"
                    placeholder="Min Frequency"
                    name="min_frec"
                  />
                </Box>

                <Box>
                  <InputField
                    label="Video Socket"
                    placeholder="Video Socket"
                    name="video_socket"
                  />
                </Box>

                <Box>
                  <SelectField
                    label="Model Size"
                    placeholder="Model Size"
                    name="model_size"
                  >
                    {SIZE.map((size: string) => (
                      <MenuItem key={uuidv4()} value={size}>
                        {size}
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

                {editMotherboard.isError && (
                  <Box my={2}>
                    <Alert severity="error">
                      {editMotherboard.error?.message}
                    </Alert>
                  </Box>
                )}

                {redirect && <Redirect to={`/admin/build/motherboard`} />}

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
