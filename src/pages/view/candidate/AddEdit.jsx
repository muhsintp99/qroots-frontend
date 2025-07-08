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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email required'),
  mobile: Yup.string().matches(/^\d{8,10}$/, 'Mobile number must be 8 to 10 digits').required('Mobile number required'),
  firstName: Yup.string().required('First name required'),
  lastName: Yup.string().required('Last name required'),
  dob: Yup.string().required('Date of Birth required'),
  addressLine1: Yup.string().required('Address Line 1 required'),
  addressLine2: Yup.string(),
  city: Yup.string().required('City required'),
  district: Yup.string(),
  state: Yup.string().required('State required'),
  zipCode: Yup.string().required('Zip code required'),
  country: Yup.string().required('Country required'),
  gender: Yup.string().required('Gender required'),
  image: Yup.mixed()
    .nullable()
    .test('fileType', 'Only image files (jpg, jpeg, png, gif) are allowed', (value) => {
      if (!value || typeof value === 'string') return true;
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
    })
    .test('fileSize', 'Image size must be less than 5MB', (value) => {
      if (!value || typeof value === 'string') return true;
      return value.size <= 5 * 1024 * 1024;
    }),
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
    if (resetFormCallback && formikRef.current) {
      resetFormCallback(() => formikRef.current.resetForm());
    }
  }, [resetFormCallback]);

  const initialValues = {
    _id: editData?._id || '',
    email: editData?.email || '',
    mobile: editData?.mobile || '',
    firstName: editData?.firstName || '',
    lastName: editData?.lastName || '',
    dob: editData?.dob || '',
    addressLine1: editData?.addressLine1 || '',
    addressLine2: editData?.addressLine2 || '',
    city: editData?.city || '',
    district: editData?.district || '',
    state: editData?.state || '',
    zipCode: editData?.zipCode || '',
    country: editData?.country || '',
    gender: editData?.gender || '',
    image: null,
    existingImage: editData?.image || null,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      email: values.email,
      mobile: values.mobile,
      firstName: values.firstName,
      lastName: values.lastName,
      dob: values.dob,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      district: values.district,
      state: values.state,
      zipCode: values.zipCode,
      country: values.country,
      gender: values.gender,
      image: values.image || values.existingImage,
    };

    onSubmit(payload, { setSubmitting, resetForm: () => formikRef.current.resetForm() });
    setPreviewImage(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Candidate</DialogTitle>

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
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="firstName"
                    label="First Name *"
                    fullWidth
                    variant="outlined"
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="lastName"
                    label="Last Name *"
                    fullWidth
                    variant="outlined"
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email *"
                    fullWidth
                    variant="outlined"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="mobile"
                    label="Mobile *"
                    fullWidth
                    variant="outlined"
                    error={touched.mobile && Boolean(errors.mobile)}
                    helperText={touched.mobile && errors.mobile}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    name="dob"
                    label="Date of Birth *"
                    InputLabelProps={{ shrink: true }}
                    value={values.dob}
                    onChange={(e) => setFieldValue('dob', e.target.value)}
                    error={touched.dob && Boolean(errors.dob)}
                    helperText={touched.dob && errors.dob}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender *</InputLabel>
                    <Select
                      name="gender"
                      value={values.gender}
                      onChange={(e) => setFieldValue('gender', e.target.value)}
                      error={touched.gender && Boolean(errors.gender)}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                    <ErrorMessage name="gender" component="div" style={{ color: 'red' }} />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="addressLine1"
                    label="Address Line 1 *"
                    fullWidth
                    variant="outlined"
                    error={touched.addressLine1 && Boolean(errors.addressLine1)}
                    helperText={touched.addressLine1 && errors.addressLine1}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="addressLine2"
                    label="Address Line 2"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="city"
                    label="City *"
                    fullWidth
                    variant="outlined"
                    error={touched.city && Boolean(errors.city)}
                    helperText={touched.city && errors.city}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="district"
                    label="District"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="state"
                    label="State *"
                    fullWidth
                    variant="outlined"
                    error={touched.state && Boolean(errors.state)}
                    helperText={touched.state && errors.state}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="zipCode"
                    label="Zip Code *"
                    fullWidth
                    variant="outlined"
                    error={touched.zipCode && Boolean(errors.zipCode)}
                    helperText={touched.zipCode && errors.zipCode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="country"
                    label="Country (ObjectId) *"
                    fullWidth
                    variant="outlined"
                    error={touched.country && Boolean(errors.country)}
                    helperText={touched.country && errors.country}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Profile Image
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
                        borderRadius: '4px',
                      }}
                    />
                    {(touched.image && errors.image) || fileError ? (
                      <Typography color="error" variant="caption">
                        {errors.image || fileError}
                      </Typography>
                    ) : null}
                  </Box>
                </Grid>
                {previewImage && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Preview:
                      </Typography>
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '1px solid #ccc',
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
                disabled={isSubmitting || !!fileError}
                sx={{ ml: 2 }}
              >
                {isSubmitting ? 'Saving...' : 'Update'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEdit;