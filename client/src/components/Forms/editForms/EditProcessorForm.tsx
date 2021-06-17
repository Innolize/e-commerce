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
import { IProcessorForm } from "src/form_types";
import { IGetBrands } from "src/hooks/types";
import useEdit from "src/hooks/useEdit";
import useGetAll from "src/hooks/useGetAll";
import useGetById from "src/hooks/useGetById";
import { IBrand, IProcessor } from "src/types";
import { PROCESSOR_ID } from "src/utils/categoriesIds";
import { processorSchema } from "src/utils/yup.pcPickerValidations";
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

const EditProcessorForm = ({ id }: Props) => {
  const classes = useStyles();
  const editProcessor = useEdit<IProcessor>("processor");
  const queryBrands = useGetAll<IGetBrands>("brand");
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

  const mapProcessor = (processor: IProcessor): IProcessorForm => {
    const processorForm: IProcessorForm = {
      id: processor.id.toString(),
      name: processor.product!.name,
      description: processor.product!.description,
      price: processor.product!.price.toString(),
      stock: processor.product!.stock.toString(),
      image: "",
      brand: processor.product!.brand.id.toString(),
      category: PROCESSOR_ID.toString(),
      cores: processor.cores.toString(),
      frecuency: processor.frecuency.toString(),
      socket: processor.socket.toString(),
      watts: processor.watts.toString(),
    };
    return processorForm;
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
            initialValues={mapProcessor(queryProcessor.data)}
            onSubmit={(data) => {
              const formData = new FormData();
              formData.append("name", data.name);
              formData.append("description", data.description);
              formData.append("price", data.price);
              formData.append("stock", data.stock);
              formData.append("id_brand", data.brand);
              formData.append("id_category", data.category);
              formData.append("product_image", data.image);
              formData.append("socket", data.socket);
              formData.append("cores", data.cores);
              formData.append("frecuency", data.frecuency);
              formData.append("watts", data.watts);
              editProcessor.mutate(formData);
            }}
            validationSchema={processorSchema}
          >
            {({ setFieldValue }) => (
              <Form className={classes.form} encType="multipart/form-data">
                <Typography variant="h4">Edit a processor</Typography>
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
                    type="number"
                    label="Frequency GHz"
                    placeholder="Frequency GHz"
                    name="frecuency"
                  />
                </Box>

                <Box>
                  <InputField
                    label="Socket"
                    placeholder="Socket"
                    name="socket"
                  />
                </Box>

                <Box>
                  <InputField
                    type="number"
                    label="Cores"
                    placeholder="Cores"
                    name="cores"
                  />
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

                {editProcessor.isError && (
                  <Box my={2}>
                    <Alert severity="error">
                      {editProcessor.error?.message}
                    </Alert>
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
