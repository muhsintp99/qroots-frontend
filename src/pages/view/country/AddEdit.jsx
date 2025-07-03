import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object({
  countryName: Yup.string().required('Country name is required'),
  code: Yup.string()
    .required('Country code is required')
    .min(2, 'Country code must be 2-3 characters')
    .max(3, 'Country code must be 2-3 characters'),
  isoCode: Yup.string()
    .required('ISO code is required')
    .min(3, 'ISO code must be 3 characters')
    .max(3, 'ISO code must be 3 characters'),
  dialCode: Yup.string().required('Dial code is required'),
  currency: Yup.string().required('Currency is required'),
  image: Yup.mixed()
    .nullable()
    .test('fileType', 'Only image files (jpg, jpeg, png, gif) are allowed', (value) => {
      if (!value || typeof value === 'string') return true; // Allow null or existing URL
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
    })
    .test('fileSize', 'Image size must be less than 5MB', (value) => {
      if (!value || typeof value === 'string') return true; // Skip for URLs or null
      return value.size <= 5 * 1024 * 1024; // 5MB limit
    })
});

const AddEdit = ({ open, onClose, onSubmit, editData, resetFormCallback }) => {
  const formikRef = useRef();
  const isEdit = Boolean(editData && editData._id);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileError, setFileError] = useState(null);

  useEffect(() => {
    if (editData?.image) {
      setPreviewImage(editData.image);
      setFileError(null);
    } else {
      setPreviewImage(null);
      setFileError(null);
    }
  }, [editData]);

  useEffect(() => {
    // Provide resetForm callback to parent
    if (resetFormCallback && formikRef.current) {
      resetFormCallback(() => formikRef.current.resetForm());
    }
  }, [resetFormCallback]);

  const initialValues = {
    _id: editData?._id || '',
    countryName: editData?.name || '',
    code: editData?.code || '',
    isoCode: editData?.isoCode || '',
    dialCode: editData?.dialCode || '',
    currency: editData?.currency || '',
    image: null,
    existingImage: editData?.image || null
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      name: values.countryName,
      code: values.code,
      isoCode: values.isoCode,
      dialCode: values.dialCode,
      currency: values.currency,
      image: values.image || values.existingImage // Send new file or existing URL
    };

    onSubmit(payload, { setSubmitting, resetForm: () => formikRef.current.resetForm() });
    setPreviewImage(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Country' : 'Add New Country'}</DialogTitle>

      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Country Name */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="countryName"
                    label="Country Name *"
                    fullWidth
                    variant="outlined"
                    error={touched.countryName && Boolean(errors.countryName)}
                    helperText={touched.countryName && errors.countryName}
                  />
                </Grid>

                {/* Country Code */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="code"
                    label="Country Code *"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., US, IN, UK"
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                  />
                </Grid>

                {/* ISO Code */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="isoCode"
                    label="ISO Code *"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., USA, IND, GBR"
                    error={touched.isoCode && Boolean(errors.isoCode)}
                    helperText={touched.isoCode && errors.isoCode}
                  />
                </Grid>

                {/* Dial Code */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="dialCode"
                    label="Dial Code *"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., +1, +91, +44"
                    error={touched.dialCode && Boolean(errors.dialCode)}
                    helperText={touched.dialCode && errors.dialCode}
                  />
                </Grid>

                {/* Currency */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="currency"
                    label="Currency *"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., USD, INR, GBP"
                    error={touched.currency && Boolean(errors.currency)}
                    helperText={touched.currency && errors.currency}
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Country Flag {isEdit ? '' : '*'}
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFileError(null);
                        if (file && file.size > 5 * 1024 * 1024) {
                          setFileError('Image size must be less than 5MB');
                          setFieldValue('image', null);
                          setPreviewImage(values.existingImage || null);
                        } else {
                          setFieldValue('image', file);
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPreviewImage(reader.result);
                            };
                            reader.readAsDataURL(file);
                          } else {
                            setPreviewImage(values.existingImage || null);
                          }
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                    {(touched.image && errors.image || fileError) && (
                      <Typography color="error" variant="caption">
                        {errors.image || fileError}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Show Preview Image */}
                {previewImage && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Preview:
                      </Typography>
                      <img
                        src={previewImage}
                        alt="Flag Preview"
                        style={{
                          width: 100,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 4,
                          border: '1px solid #ccc'
                        }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !!fileError || (!isEdit && !values.image)}
                sx={{ ml: 2 }}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEdit;