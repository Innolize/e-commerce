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
import { ICabinetForm, IProductForm } from "src/form_types";
import { IGetBrands } from "src/hooks/types";
import useCreate from "src/hooks/useCreate";
import useGetAll from "src/hooks/useGetAll";
import { IBrand, ICabinet, SIZE } from "src/types";
import { CABINET_ID } from "src/utils/categoriesIds";
import { cabinetSchema } from "src/utils/yup.pcPickerValidations";
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

const CabinetForm = () => {
  const classes = useStyles();
  const createCabinet = useCreate<ICabinet>("cabinet");
  const queryBrands = useGetAll<IGetBrands>("brand");
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
        <SnackbarAlert
          severity="success"
          text="Cabinet created successfully. You will be redirected soon..."
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
            category: CABINET_ID.toString(),
            brand: "",
            size: "",
            generic_pws: "true",
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
              <Typography variant="h4">Create a cabinet</Typography>
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
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </SelectField>
              )}

              <Field hidden name="category" label="Category"></Field>

              <Box>
                <SelectField label="Size" name="size">
                  {SIZE.map((size: string) => (
                    <MenuItem key={uuidv4()} value={size}>
                      {size}
                    </MenuItem>
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
                  <Alert severity="error">
                    {createCabinet.error?.message || "Something went wrong"}
                  </Alert>
                </Box>
              )}

              {redirect && <Redirect to={`/admin/build/cabinet`} />}

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
