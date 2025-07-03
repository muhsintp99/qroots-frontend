import React, { useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getCountry } from '../../container/country/slice';
import { useDispatch, useSelector } from 'react-redux';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  reference: Yup.string().required('Reference is required'),
  country: Yup.string().required('Country is required'),
  description: Yup.string().required('Description is required'),
});

const AddEdit = ({ open, onClose, onSubmit, editData = null }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(editData && editData._id);
  const { countries, loading: countryLoading, error: countryError } = useSelector((state) => state.country || { countries: [], loading: false, error: null });

  useEffect(() => {
    if (open && !countries.length && !countryLoading) {
      dispatch(getCountry());
    }
  }, [dispatch, open, countries.length, countryLoading]);

  const initialValues = {
    title: editData?.title || '',
    reference: editData?.reference || '',
    country: editData?.country?._id || '',
    description: editData?.description || '',
  };

  const isCountryValid = editData?.country?._id && countries.some(c => c._id === editData.country._id);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    onSubmit(values, { setSubmitting, resetForm });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form>
            <DialogContent>
              {countryError && (
                <Typography color="error" sx={{ mb: 2 }}>
                  Failed to load countries: {countryError}
                </Typography>
              )}
              {isEdit && !isCountryValid && editData?.country?._id && (
                <Typography color="error" sx={{ mb: 2 }}>
                  Selected country is invalid or no longer available.
                </Typography>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="title"
                    label="Title *"
                    fullWidth
                    variant="outlined"
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="reference"
                    label="Reference *"
                    fullWidth
                    variant="outlined"
                    error={touched.reference && Boolean(errors.reference)}
                    helperText={touched.reference && errors.reference}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={touched.country && Boolean(errors.country)}>
                    <InputLabel id="country-label">Country *</InputLabel>
                    <Field
                      as={Select}
                      name="country"
                      labelId="country-label"
                      label="Country *"
                      value={values.country}
                      onChange={(e) => setFieldValue('country', e.target.value)}
                      disabled={countryLoading || countries.length === 0}
                    >
                      <MenuItem value=""><em>{countryLoading ? 'Loading countries...' : 'Select a country'}</em></MenuItem>
                      {countries.map((country) => (
                        <MenuItem key={country._id} value={country._id}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Field>
                    {countryLoading && <CircularProgress size={24} sx={{ position: 'absolute', right: 40, top: 20 }} />}
                    {touched.country && errors.country && (
                      <Typography color="error" variant="caption">
                        {errors.country}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="description"
                    label="Description *"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={onClose} variant="outlined">Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting || countryLoading}>
                {isEdit ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEdit;