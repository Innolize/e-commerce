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
import { IPowerSupplyForm, IProductForm } from "src/form_types";
import useBrands from "src/hooks/brandHooks/useBrands";
import useCreatePowerSupply from "src/hooks/productHooks/powerSupply/useCreatePowerSupply";
import { IBrand, ICategory, PWS_CERTIFICATION } from "src/types";
import { powerSupplySchema } from "src/utils/yup.pcPickerValidations";
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

const PowerSupplyForm = ({ category }: Props) => {
  const classes = useStyles();
  const createPowerSupply = useCreatePowerSupply();
  const queryBrands = useBrands();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (createPowerSupply.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [createPowerSupply.isSuccess]);

  return (
    <Container>
      {createPowerSupply.isSuccess && (
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
            certification: "",
            watts: "",
          }}
          onSubmit={(data: IProductForm & IPowerSupplyForm) => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("stock", data.stock);
            formData.append("id_brand", data.brand);
            formData.append("id_category", data.category);
            formData.append("product_image", data.image);
            formData.append("certification", data.certification);
            formData.append("watts", data.watts);
            createPowerSupply.mutate(formData);
          }}
          validationSchema={powerSupplySchema}
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
                <SelectField label="Certification" name="certification">
                  {PWS_CERTIFICATION.map((certification: string) => (
                    <MenuItem value={certification}>{certification}</MenuItem>
                  ))}
                </SelectField>
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

              {createPowerSupply.isError && (
                <Box my={2}>
                  <Alert severity="error">
                    {createPowerSupply.error?.message}
                  </Alert>
                </Box>
              )}

              {redirect && <Redirect to={`/admin/products/${category.id}`} />}

              <Box my={3}>
                {createPowerSupply.isLoading ? (
                  <LoadingButton isSubmitting name="Submiting..." />
                ) : createPowerSupply.isSuccess ? (
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

export default PowerSupplyForm;
