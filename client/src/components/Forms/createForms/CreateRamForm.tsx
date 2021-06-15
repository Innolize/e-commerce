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
import { IProductForm, IRamForm } from "src/form_types";
import { IGetBrands } from "src/hooks/types";
import useCreate from "src/hooks/useCreate";
import useGetAll from "src/hooks/useGetAll";
import { IBrand, IRam } from "src/types";
import { RAM_ID } from "src/utils/categoriesIds";
import { ramSchema } from "src/utils/yup.pcPickerValidations";
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

const RamForm = () => {
  const classes = useStyles();
  const createRam = useCreate<IRam>("ram");
  const queryBrands = useGetAll<IGetBrands>("brand");
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

  return (
    <Container>
      {createRam.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Ram created successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      <Box className={classes.formContainer}>
        <Formik
          initialValues={{
            name: "",
            image: "",
            description: "",
            price: "",
            stock: "",
            category: RAM_ID.toString(),
            brand: "",
            ram_version: "",
            memory: "",
            min_frec: "",
            max_frec: "",
            watts: "",
          }}
          onSubmit={(data: IProductForm & IRamForm) => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("stock", data.stock);
            formData.append("id_brand", data.brand);
            formData.append("id_category", data.category);
            formData.append("product_image", data.image);
            formData.append("memory", data.memory);
            formData.append("ram_version", data.ram_version);
            formData.append("min_frec", data.min_frec);
            formData.append("max_frec", data.max_frec);
            formData.append("watts", data.watts);
            createRam.mutate(formData);
          }}
          validationSchema={ramSchema}
        >
          {({ setFieldValue }) => (
            <Form className={classes.form} encType="multipart/form-data">
              <Typography variant="h4">Create a ram</Typography>
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
                <SelectField
                  label="RAM Version"
                  placeholder="RAM Version"
                  name="ram_version"
                >
                  <MenuItem value="DDR1">DDR1</MenuItem>
                  <MenuItem value="DDR2">DDR2</MenuItem>
                  <MenuItem value="DDR3">DDR3</MenuItem>
                  <MenuItem value="DDR4">DDR4</MenuItem>
                </SelectField>
              </Box>

              <Box>
                <InputField
                  label="Max Frequency"
                  placeholder="Max Frequency"
                  name="max_frec"
                />
              </Box>

              <Box>
                <InputField
                  label="Min Frequency"
                  placeholder="Min Frequency"
                  name="min_frec"
                />
              </Box>

              <Box>
                <InputField label="Memory" placeholder="Memory" name="memory" />
              </Box>

              <Box>
                <InputField label="Watts" placeholder="Watts" name="watts" />
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
      </Box>
    </Container>
  );
};

export default RamForm;
