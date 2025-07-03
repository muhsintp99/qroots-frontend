import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  MenuItem
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

// Validation schema
const validationSchema = Yup.object({
  couponTitle: Yup.string().required('Coupon title is required'),
  code: Yup.string()
    .required('Coupon code is required')
    .matches(/^[A-Za-z0-9]+$/, 'Coupon code must be alphanumeric'),
  discount: Yup.number()
    .required('Discount is required')
    .min(0, 'Discount must be at least 0')
    .max(100, 'Discount cannot exceed 100%'),
  endDate: Yup.date()
    .required('End date is required')
    .min(new Date(new Date().setDate(new Date().getDate() + 1)), 'End date must be in the future'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'expired'], 'Invalid status')
});

const AddEdit = ({ open, onClose, onSubmit, editData }) => {
  const isEdit = Boolean(editData && editData._id);
  const { error } = useSelector((state) => state.coupons || { error: null });

  const initialValues = {
    couponTitle: editData?.couponTitle || '',
    code: editData?.code || '',
    discount: editData?.discount || '',
    endDate: editData?.endDate ? new Date(editData.endDate).toISOString().split('T')[0] : '',
    status: editData?.status || 'active'
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(values);
          setSubmitting(false);
          resetForm();
        }}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              {/* Server Error Display */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={3}>
                {/* Coupon Title */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="couponTitle"
                    label="Coupon Title *"
                    fullWidth
                    variant="outlined"
                    error={touched.couponTitle && Boolean(errors.couponTitle)}
                    helperText={touched.couponTitle && errors.couponTitle}
                  />
                </Grid>

                {/* Coupon Code */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="code"
                    label="Coupon Code *"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., SUMMER20"
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                  />
                </Grid>

                {/* Discount */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="discount"
                    label="Discount (%)*"
                    type="number"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., 20"
                    error={touched.discount && Boolean(errors.discount)}
                    helperText={touched.discount && errors.discount}
                  />
                </Grid>

                {/* End Date */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="endDate"
                    label="End End Date *"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={touched.endDate && Boolean(errors.endDate)}
                    helperText={touched.endDate && errors.endDate}
                  />
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
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                  </Field>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => {
                  onClose();
                }}
                variant="outlined"
              >
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