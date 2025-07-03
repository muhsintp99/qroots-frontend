import React, { useState, useEffect } from 'react';
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
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Validation schema based on blog schema
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  shortDesc: Yup.string().required('Short Description is required'),
  fullDesc: Yup.string().required('Full Description is required'),
  link: Yup.string()
    .nullable()
    .matches(
      /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-\.]*)*\/?$/,
      { message: 'Enter a valid URL', excludeEmptyString: true }
    ),
  image: Yup.mixed()
    .test('fileOrUrl', 'Image is required', (value, context) => {
      const isEdit = Boolean(context.parent._id); // Check if in edit mode
      if (isEdit && context.parent.existingImage) return true; // Allow existing image URL
      if (!value) return false; // Require file for new blog
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
    })
    .test('fileSize', 'Image size must be less than 5MB', (value) => {
      if (!value || typeof value === 'string') return true; // Skip for URLs or no file
      return value.size <= 5 * 1024 * 1024; // 5MB limit
    }),
  createdBy: Yup.string().default('admin'),
  updatedBy: Yup.string().default('admin'),
  isVisible: Yup.boolean().default(true),
});

const AddEdit = ({ open, onClose, onSubmit, editData }) => {
  const isEdit = Boolean(editData && editData._id);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileError, setFileError] = useState(null);

  useEffect(() => {
    if (editData?.image) {
      setPreviewImage(editData.image); // Set preview to existing image URL
      setFileError(null); // Clear file error in edit mode
    } else {
      setPreviewImage(null);
      setFileError(null);
    }
  }, [editData]);

  const initialValues = {
    _id: editData?._id || '',
    title: editData?.title || '',
    shortDesc: editData?.shortDesc || '',
    fullDesc: editData?.fullDesc || '',
    link: editData?.link || '',
    createdBy: editData?.createdBy || 'admin',
    updatedBy: editData?.updatedBy || 'admin',
    isVisible: editData?.isVisible !== undefined ? editData.isVisible : true,
    image: null,
    existingImage: editData?.image || null,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      title: values.title,
      shortDesc: values.shortDesc,
      fullDesc: values.fullDesc,
      link: values.link,
      createdBy: values.createdBy,
      updatedBy: values.updatedBy,
      isVisible: values.isVisible,
      image: values.image || values.existingImage,
    };

    onSubmit(payload);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Title */}
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

                {/* Short Description */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="shortDesc"
                    label="Short Description *"
                    fullWidth
                    variant="outlined"
                    error={touched.shortDesc && Boolean(errors.shortDesc)}
                    helperText={touched.shortDesc && errors.shortDesc}
                  />
                </Grid>

                {/* Full Description */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="fullDesc"
                    label="Full Description *"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    error={touched.fullDesc && Boolean(errors.fullDesc)}
                    helperText={touched.fullDesc && errors.fullDesc}
                  />
                </Grid>

                {/* Link */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="link"
                    label="Link"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., https://example.com"
                    error={touched.link && Boolean(errors.link)}
                    helperText={touched.link && errors.link}
                  />
                </Grid>

                {/* Visibility Checkbox */}
                {/* <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <FormControlLabel
                      control={
                        <Field name="isVisible">
                          {({ field }) => (
                            <Checkbox
                              {...field}
                              checked={values.isVisible}
                              onChange={(e) => setFieldValue('isVisible', e.target.checked)}
                              color="primary"
                            />
                          )}
                        </Field>
                      }
                      label={
                        <Typography variant="body1">
                          Make blog visible to public
                        </Typography>
                      }
                    />
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ ml: 4, display: 'block' }}>
                    {values.isVisible ? 'Blog will be published and visible to users' : 'Blog will be saved as draft'}
                  </Typography>
                </Grid> */}

                {/* Image Upload */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Blog Image {isEdit ? '' : '*'}
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFileError(null); // Reset error
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
                        alt="Blog Preview"
                        style={{
                          width: 100,
                          height: 100,
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
                disabled={isSubmitting || !!fileError}
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