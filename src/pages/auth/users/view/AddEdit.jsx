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
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from '../container/slice';

// Validation schema
const validationSchema = Yup.object({
  fname: Yup.string().required('First name is required'),
  lname: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  mobile: Yup.string().required('Mobile number is required'),
  password: Yup.string().when('isEdit', {
    is: (value) => value === false,
    then: (schema) =>
      schema
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    otherwise: (schema) => schema.notRequired(),
  }),
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

const AddEdit = ({ open, onClose, editData }) => {
  const dispatch = useDispatch();
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

  const initialValues = {
    _id: editData?._id || '',
    fname: editData?.fname || '',
    lname: editData?.lname || '',
    email: editData?.email || '',
    mobile: editData?.mobile || '',
    password: '',
    image: null,
    existingImage: editData?.image || null,
    userType: 'licensee',
    status: editData?.status || 'active',
    isEdit,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      fname: values.fname,
      lname: values.lname,
      email: values.email,
      mobile: values.mobile,
      password: values.password,
      image: values.image || values.existingImage,
      userType: 'licensee',
      status: values.status,
      onClose,
    };

    if (isEdit) {
      dispatch(updateUser({ _id: values._id, ...payload }));
    } else {
      dispatch(addUser(payload));
    }
    setSubmitting(false);
    setPreviewImage(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Licensee' : 'Add New Licensee'}</DialogTitle>
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
                    name="fname"
                    label="First Name *"
                    fullWidth
                    variant="outlined"
                    error={touched.fname && Boolean(errors.fname)}
                    helperText={touched.fname && errors.fname}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="lname"
                    label="Last Name *"
                    fullWidth
                    variant="outlined"
                    error={touched.lname && Boolean(errors.lname)}
                    helperText={touched.lname && errors.lname}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email *"
                    fullWidth
                    variant="outlined"
                    disabled={isEdit} // Disable email field in edit mode
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
                    disabled={isEdit} // Disable mobile field in edit mode
                    error={touched.mobile && Boolean(errors.mobile)}
                    helperText={touched.mobile && errors.mobile}
                  />
                </Grid>
                {!isEdit && (
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="password"
                      label="Password *"
                      type="password"
                      fullWidth
                      variant="outlined"
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Profile Image {isEdit ? '' : '*'}
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
                          borderRadius: 4,
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