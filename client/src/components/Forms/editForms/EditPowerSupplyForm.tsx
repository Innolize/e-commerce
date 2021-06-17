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
import { IPowerSupplyForm } from "src/form_types";
import { IGetBrands } from "src/hooks/types";
import useEdit from "src/hooks/useEdit";
import useGetAll from "src/hooks/useGetAll";
import useGetById from "src/hooks/useGetById";
import { IBrand, IPowerSupply, PWS_CERTIFICATION } from "src/types";
import { POWER_SUPPLY_ID } from "src/utils/categoriesIds";
import { powerSupplySchema } from "src/utils/yup.pcPickerValidations";
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

const EditPowerSupplyForm = ({ id }: Props) => {
  const classes = useStyles();
  const editPowerSupply = useEdit<IPowerSupply>("power-supply");
  const queryPowerSupply = useGetById<IPowerSupply>("power-supply", id);
  const queryBrands = useGetAll<IGetBrands>("brand");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (editPowerSupply.isSuccess) {
      timer = setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [editPowerSupply.isSuccess]);

  const mapPowerSupply = (powerSupply: IPowerSupply): IPowerSupplyForm => {
    const powerSupplyForm: IPowerSupplyForm = {
      id: powerSupply.id.toString(),
      name: powerSupply.product!.name,
      description: powerSupply.product!.description,
      price: powerSupply.product!.price.toString(),
      stock: powerSupply.product!.stock.toString(),
      image: "",
      brand: powerSupply.product!.brand.id.toString(),
      category: POWER_SUPPLY_ID.toString(),
      certification: powerSupply.certification,
      watts: powerSupply.watts.toString(),
    };

    return powerSupplyForm;
  };

  return (
    <Container>
      {editPowerSupply.isSuccess && (
        <SnackbarAlert
          severity="success"
          text="Power supply edited successfully. You will be redirected soon..."
        ></SnackbarAlert>
      )}

      {queryPowerSupply.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            Error finding the power supply.
          </Typography>
        </Box>
      )}

      {queryPowerSupply.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}

      {queryPowerSupply.isSuccess && (
        <Box className={classes.formContainer}>
          <Formik
            initialValues={mapPowerSupply(queryPowerSupply.data)}
            onSubmit={(data) => {
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
              editPowerSupply.mutate(formData);
            }}
            validationSchema={powerSupplySchema}
          >
            {({ setFieldValue }) => (
              <Form className={classes.form} encType="multipart/form-data">
                <Typography variant="h4">Edit a power supply</Typography>
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
                  <SelectField label="Certification" name="certification">
                    {PWS_CERTIFICATION.map((certification: string) => (
                      <MenuItem value={certification}>{certification}</MenuItem>
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

                {editPowerSupply.isError && (
                  <Box my={2}>
                    <Alert severity="error">
                      {editPowerSupply.error?.message}
                    </Alert>
                  </Box>
                )}

                {redirect && <Redirect to={`/admin/build/power-supply`} />}

                <Box my={3}>
                  {editPowerSupply.isLoading ? (
                    <LoadingButton isSubmitting name="Submiting..." />
                  ) : editPowerSupply.isSuccess ? (
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

export default EditPowerSupplyForm;
