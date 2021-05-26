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
import useBrands from "src/hooks/brandHooks/useBrands";
import { IBrand, ICategory } from "src/types";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { v4 as uuidv4 } from "uuid";
import { Redirect } from "react-router-dom";
import LoadingButton from "../LoadingButton";
import useCreateRam from "src/hooks/productHooks/ram/useCreateRam";
import { IProductForm, IRamForm } from "src/form_types";
import { ramSchema } from "src/utils/yup.pcPickerValidations";

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
  category: ICategory;
}

const RamForm = ({ category }: Props) => {
  const classes = useStyles();
  const createRam = useCreateRam();
  const queryBrands = useBrands();
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
        <Box my={2}>
          <Alert severity="success">
            Product created successfully. You will be redirected soon...
          </Alert>
        </Box>
      )}

      <Box className={classes.formContainer}>
        <Formik
          initialValues={{
            name: "",
            image: "",
            description: "",
            price: "",
            stock: "",
            category: category.id.toString(),
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
              <Typography variant="h4">Create a: {category.name}</Typography>
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

              {redirect && <Redirect to={`/admin/products/${category.id}`} />}

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
