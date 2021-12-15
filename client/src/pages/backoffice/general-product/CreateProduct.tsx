import { Box, Checkbox, Container, Input, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SelectField from "src/components/SelectField";
import SnackbarAlert from "src/components/SnackbarAlert";
import { IProductForm } from "src/form_types";
import { IGetAllBrands, IGetAllCategories } from "src/hooks/types";
import useCreate from "src/hooks/useCreate";
import useGetAll from "src/hooks/useGetAll";
import { IBrand, ICategory, IProduct } from "src/types";
import { createProductSchema } from "src/utils/yup.validations";
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
  const classes = useStyles();
  const createProduct = useCreate<IProduct>("product");
  const queryBrands = useGetAll<IGetAllBrands>("brand");
  const queryCategories = useGetAll<IGetAllCategories>("category");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (createProduct.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [createProduct.isSuccess]);

  return (
    <Container>
      {createProduct.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Product created successfully. You will be redirected soon..."
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
            category: "",
            brand: "",
          }}
          onSubmit={(data: IProductForm) => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("stock", data.stock);
            formData.append("id_brand", data.brand);
            formData.append("id_category", data.category);
            formData.append("product_image", data.image);
            createProduct.mutate(formData);
          }}
          validationSchema={createProductSchema}
        >
          {({ setFieldValue }) => (
            <Form className={classes.form} encType="multipart/form-data">
              <Typography variant="h4">Create a product</Typography>
              <Box>
                <InputField label="Name" placeholder="Name" name="name" />
              </Box>
              <Box>
                <InputField rows={5} multiline label="Description" placeholder="Description" name="description" />
              </Box>
              <Box>
                <InputField type="number" label="Price" placeholder="Price" name="price" />
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

              {queryCategories.isSuccess && (
                <SelectField name="category" label="Category">
                  {queryCategories.data.results.map((category: ICategory) => (
                    <MenuItem key={uuidv4()} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </SelectField>
              )}

              <Box display="flex" alignItems="center">
                <Typography>Stock:</Typography>
                <Field type="checkbox" name="stock" as={Checkbox} />
                <ErrorMessage component={Typography} className={classes.errorMsg} name="stock" />
              </Box>

              <Box my={3}>
                <Input
                  type="file"
                  placeholder="Image"
                  name="image"
                  fullWidth
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("image", e.target.files![0])}
                />
                <ErrorMessage component={Typography} className={classes.errorMsg} name="image" />
              </Box>

              {createProduct.isError && (
                <Box my={2}>
                  <Alert severity="error">{createProduct.error?.message || "Something went wrong."}</Alert>
                </Box>
              )}

              {redirect && <Navigate to={`/admin/products`} />}

              <Box my={3}>
                {createProduct.isLoading ? (
                  <LoadingButton isSubmitting name="Submiting..." />
                ) : createProduct.isSuccess ? (
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

export default CreateProduct;
