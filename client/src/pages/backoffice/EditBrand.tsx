import { Box, Button, CircularProgress, Container, Input, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ErrorMessage, Form, Formik } from 'formik';
import Image from 'material-ui-image';
import React from 'react';
import { useParams } from 'react-router-dom';
import InputField from 'src/components/InputField';
import useEditBrand from '../../hooks/brandHooks/useEditBrand';
import useGetBrandById from '../../hooks/brandHooks/useGetBrandById';
import { IBrand } from '../../types';
import Alert from '@material-ui/lab/Alert';
import { editBrandSchema } from '../../utils/yup.validations';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  form: {
    maxWidth: '320px',
  },
  image: {
    width: '300px',
    height: '150px',
  },
  noImage: {
    width: '300px',
    height: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    color: 'black',
  },
  errorMsg: {
    color: '#f44336',
    fontSize: '0.75rem',
    textAlign: 'start',
  },
  hidden: {
    display: 'none',
  },
}));

const CreateBrand = () => {
  const { id } = useParams<{ id: string }>();
  const queryBrand = useGetBrandById(id);
  const editBrand = useEditBrand();
  const classes = useStyles();

  return (
    <Container>
      {queryBrand.isError && (
        <Box textAlign="center" mt={12}>
          <Typography variant="h3" color="error">
            {queryBrand.error.message}
          </Typography>
        </Box>
      )}
      {queryBrand.isLoading && (
        <Box textAlign="center" mt={12}>
          <CircularProgress />
        </Box>
      )}
      {editBrand.isSuccess && (
        <Box my={2}>
          <Alert severity="success">Sucessfully edited!</Alert>
        </Box>
      )}

      {queryBrand.isSuccess && (
        <Box className={classes.formContainer} my={10}>
          <Typography variant="h4">Edit the brand</Typography>
          <Formik
            initialValues={{ name: queryBrand.data.name, logo: '', id }}
            onSubmit={async (data: IBrand) => {
              const formData = new FormData();

              // If the form was not modified we dont submit
              // This will not stop the user from uploading the same image/file - TODO?
              if (data.name === queryBrand.data.name && !data.logo) {
                return;
              }

              editBrand.mutate(formData);
            }}
            validationSchema={editBrandSchema}
          >
            {({ setFieldValue }) => (
              <Form className={classes.form} encType="multipart/form-data">
                <Box display="flex" my={1}>
                  <InputField label="Name" placeholder="Name" name="name" />
                </Box>
                <Box display="flex" justifyContent="center">
                  <Paper className={classes.image}>
                    {queryBrand.data.logo ? (
                      <Image
                        imageStyle={{ borderRadius: '4px', height: '150px' }}
                        style={{ borderRadius: '4px', paddingTop: '0', height: '150px' }}
                        src={queryBrand.data.logo}
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
                    placeholder="Logo"
                    name="logo"
                    color="secondary"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue('logo', e.target.files![0])
                    }
                  />
                  <ErrorMessage component={Typography} className={classes.errorMsg} name="logo" />
                </Box>
                {editBrand.isError && (
                  <Box my={2}>
                    <Alert severity="error">{editBrand.error?.message}</Alert>
                  </Box>
                )}
                <Box my={3}>
                  <Button type="submit" variant="contained" color="primary">
                    Submit changes
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Container>
  );
};

export default CreateBrand;
