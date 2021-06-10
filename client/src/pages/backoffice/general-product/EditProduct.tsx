import {
  Box,
  Checkbox,
  CircularProgress,
  Container,
  Input,
  MenuItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "material-ui-image";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import InputField from "src/components/InputField";
import LoadingButton from "src/components/LoadingButton";
import SelectField from "src/components/SelectField";
import SnackbarAlert from "src/components/SnackbarAlert";
import useBrands from "src/hooks/brandHooks/useBrands";
import useCategories from "src/hooks/categoryHooks/useCategories";
import useEditProduct from "src/hooks/productHooks/generalProducts/useEditProduct";
import useGetProductById from "src/hooks/productHooks/generalProducts/useGetProductById";
import { IBrand, ICategory } from "src/types";
import { editProductSchema } from "src/utils/yup.validations";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  form: {
    maxWidth: "320px",
  },
  image: {
    width: "300px",
    height: "150px",
  },
  noImage: {
    width: "300px",
    height: "150px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    color: "black",
  },
  errorMsg: {
    color: "#f44336",
    fontSize: "0.75rem",
    textAlign: "start",
  },
  hidden: {
    display: "none",
  },
}));

const EditProduct = () => {
  const queryCategories = useCategories();
  const queryBrands = useBrands();
  const { id } = useParams<{ id: string }>();
  const queryProduct = useGetProductById(id);
  const editProduct = useEditProduct();
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (editProduct.isSuccess) {
      timer = setTimeout(() => {
        history.goBack();
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [editProduct.isSuccess, history]);

  return (
    <Container>
      {queryProduct.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the product.
          </Typography>
        </Box>
      )}

      {queryProduct.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {editProduct.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Product edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {queryProduct.isSuccess && (
        <Box className={classes.formContainer} my={10}>
          <Typography variant="h4">Edit the product</Typography>
          <Formik
            initialValues={{
              name: queryProduct.data.name,
              image: "",
              description: queryProduct.data.description,
              price: queryProduct.data.price,
              stock: queryProduct.data.stock,
              category: queryProduct.data.category?.id || "",
              brand: queryProduct.data.brand?.id || "",
              id,
            }}
            onSubmit={async (data) => {
              const formData = new FormData();

              formData.append("id", id);
              formData.append("name", data.name);
              formData.append("description", data.description);
              formData.append("price", data.price);
              formData.append("stock", data.stock);
              formData.append("id_brand", data.brand);
              formData.append("id_category", data.category);
              formData.append("product_image", data.image);

              editProduct.mutate(formData);
            }}
            validationSchema={editProductSchema}
          >
            {({ setFieldValue }) => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box display="flex" my={1}>
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

                <Box display="flex" justifyContent="center">
                  <Paper className={classes.image}>
                    {queryProduct.data.image ? (
                      <Image
                        imageStyle={{ borderRadius: "4px", height: "150px" }}
                        style={{
                          borderRadius: "4px",
                          paddingTop: "0",
                          height: "150px",
                        }}
                        src={queryProduct.data.image}
                      />
                    ) : (
                      <Paper className={classes.noImage}>
                        <Typography>Image not found.</Typography>
                      </Paper>
                    )}
                  </Paper>
                </Box>
                <Box my={3}>
                  <Input
                    type="file"
                    placeholder="Image"
                    name="image"
                    color="secondary"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue("image", e.target.files![0])
                    }
                  />
                  <ErrorMessage
                    component={Typography}
                    className={classes.errorMsg}
                    name="logo"
                  />
                </Box>

                {editProduct.isError && (
                  <Box my={2}>
                    <Alert severity="error">
                      {editProduct.error?.message || "Something went wrong."}
                    </Alert>
                  </Box>
                )}

                <Box>
                  {editProduct.isLoading ? (
                    <LoadingButton isSubmitting name="Editing..." />
                  ) : editProduct.isSuccess ? (
                    <LoadingButton isSuccess name="Submited" />
                  ) : (
                    <LoadingButton name="Submit changes" />
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

export default EditProduct;
