import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  rate: Yup.number()
    .required('Rate is required')
    .min(0, 'Rate must be at least 0'),
  type: Yup.string()
    .required('Type is required')
    .oneOf(['month', 'year'], 'Invalid type'),
  points: Yup.string().nullable(),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['recommended', 'popular', 'new'], 'Invalid status'),
  description: Yup.string().nullable()
});

const AddEdit = ({ open, onClose, onSubmit, editData }) => {
  const isEdit = Boolean(editData && editData._id);

  const initialValues = {
    title: editData?.title || '',
    description: editData?.description || '',
    rate: editData?.rate || '',
    type: editData?.type || '',
    points: editData?.points?.join(', ') || '',
    status: editData?.status || 'new',
    isActive: editData?.isActive !== undefined ? editData.isActive : true
  };

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Package' : 'Add New Package'}</DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting }) => (
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

                {/* Rate */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="rate"
                    label="Rate ($)*"
                    type="number"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., 99.99"
                    error={touched.rate && Boolean(errors.rate)}
                    helperText={touched.rate && errors.rate}
                  />
                </Grid>

                {/* Type */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="type"
                    label="Type *"
                    select
                    fullWidth
                    variant="outlined"
                    error={touched.type && Boolean(errors.type)}
                    helperText={touched.type && errors.type}
                  >
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                  </Field>
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="status"
                    label="Status *"
                    select
                    fullWidth
                    variant="outlined"
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="recommended">Recommended</MenuItem>
                    <MenuItem value="popular">Popular</MenuItem>
                    <MenuItem value="new">New</MenuItem>
                  </Field>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="description"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>

                {/* Points */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="points"
                    label="Points (comma-separated)"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., 10 job postings, Basic support"
                    error={touched.points && Boolean(errors.points)}
                    helperText={touched.points && errors.points}
                  />
                </Grid>

                {/* Is Active */}
                <Grid item xs={12}>
                  <Field
                    as={FormControlLabel}
                    name="isActive"
                    control={<Checkbox checked={values.isActive} />}
                    label="Active"
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
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