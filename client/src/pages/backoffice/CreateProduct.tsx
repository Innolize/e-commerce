import { Formik, Form, ErrorMessage, Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import InputField from "src/components/InputField";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Input,
  MenuItem,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { createProductSchema } from "../../utils/yup.validations";
import Alert from "@material-ui/lab/Alert";
import useCreateProduct from "src/hooks/productHooks/useCreateProduct";
import useCategories from "src/hooks/categoryHooks/useCategories";
import useBrands from "src/hooks/brandHooks/useBrands";
import { IBrand, ICategory } from "src/types";
import SelectField from "src/components/SelectField";
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

const CreateProduct = () => {
  const queryCategories = useCategories();
  const queryBrands = useBrands();
  const createProduct = useCreateProduct();
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);

  createProduct.isSuccess &&
    setTimeout(() => {
      setRedirect(true);
    }, 2500);

  return (
    <Container>
      {createProduct.isSuccess && (
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
            category: "",
            brand: "",
          }}
          onSubmit={(data) => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("stock", data.stock);
            formData.append("id_category", data.category);
            formData.append("id_brand", data.brand);
            formData.append("product_image", data.image);
            createProduct.mutate(formData);
          }}
          validationSchema={createProductSchema}
        >
          {({ setFieldValue }) => (
            <Form className={classes.form} encType="multipart/form-data">
              <Typography variant="h4">Create a new product</Typography>
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

              {queryCategories.isSuccess && (
                <SelectField name="category" label="Category">
                  {queryCategories.data.map((category: ICategory) => (
                    <MenuItem key={uuidv4()} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </SelectField>
              )}

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

              {createProduct.isError && (
                <Box my={2}>
                  <Alert severity="error">{createProduct.error?.message}</Alert>
                </Box>
              )}

              {redirect && <Redirect to="/admin/products" />}

              <Box my={3}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default CreateProduct;
