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
import { ICabinetForm, IProductForm } from "src/form_types";
import useBrands from "src/hooks/brandHooks/useBrands";
import useCreateCabinet from "src/hooks/productHooks/cabinet/useCreateCabinet";
import { IBrand, ICategory, SIZE } from "src/types";
import { cabinetSchema } from "src/utils/yup.pcPickerValidations";
import { v4 as uuidv4 } from "uuid";
import InputField from "../InputField";
import LoadingButton from "../LoadingButton";
import SelectField from "../SelectField";

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

const CabinetForm = ({ category }: Props) => {
  const classes = useStyles();
  const createCabinet = useCreateCabinet();
  const queryBrands = useBrands();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (createCabinet.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [createCabinet.isSuccess]);

  return (
    <Container>
      {createCabinet.isSuccess && (
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
            size: "",
            generic_pws: "",
          }}
          onSubmit={(data: IProductForm & ICabinetForm) => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("stock", data.stock);
            formData.append("id_brand", data.brand);
            formData.append("id_category", data.category);
            formData.append("product_image", data.image);
            formData.append("size", data.size);
            formData.append("generic_pws", data.generic_pws);
            createCabinet.mutate(formData);
          }}
          validationSchema={cabinetSchema}
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
                <SelectField label="Size" name="size">
                  {SIZE.map((size: string) => (
                    <MenuItem value={size}>{size}</MenuItem>
                  ))}
                </SelectField>
              </Box>

              <Box display="flex" alignItems="center">
                <Typography>Generic PWS:</Typography>
                <Field type="checkbox" name="generic_pws" as={Checkbox} />
                <ErrorMessage
                  component={Typography}
                  className={classes.errorMsg}
                  name="generic_pws"
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

              {createCabinet.isError && (
                <Box my={2}>
                  <Alert severity="error">{createCabinet.error?.message}</Alert>
                </Box>
              )}

              {redirect && <Redirect to={`/admin/products/${category.id}`} />}

              <Box my={3}>
                {createCabinet.isLoading ? (
                  <LoadingButton isSubmitting name="Submiting..." />
                ) : createCabinet.isSuccess ? (
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

export default CabinetForm;
