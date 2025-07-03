import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Typography,
  MenuItem, Select, InputLabel, FormControl, CircularProgress, Alert
} from '@mui/material';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../container/slice';

const validationSchema = Yup.object({
  fname: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be 50 characters or less')
    .required('First name is required'),
  lname: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be 50 characters or less')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  mobile: Yup.string()
    .matches(/^\+?\d{10,15}$/, 'Must be a valid mobile number (10-15 digits, optional +)')
    .required('Mobile is required'),
  password: Yup.string().when('isEdit', {
    is: false,
    then: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
      .required('Password is required'),
    otherwise: Yup.string(),
  }),
  userType: Yup.string()
    .oneOf(['admin', 'licensee'], 'Invalid user type')
    .required('User type is required'),
});

const AddEdit = ({ open, onClose, onSubmit, editData }) => {
  const isEdit = Boolean(editData && editData._id);
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.users);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    if (error) {
      setSubmissionError(error.message);
    }
    return () => {
      dispatch(clearError());
    };
  }, [error, dispatch]);

  const initialValues = {
    fname: editData?.fname || '',
    lname: editData?.lname || '',
    email: editData?.email || '',
    mobile: editData?.mobile || '',
    password: '',
    userType: editData?.userType || 'licensee',
    image: null,
    isEdit,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableEnforceFocus
      aria-labelledby="user-form-title"
    >
      <DialogTitle id="user-form-title">{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={true}
        onSubmit={(values, { setSubmitting }) => {
          setSubmissionError(null);
          const payload = {
            fname: values.fname,
            lname: values.lname,
            ...(isEdit ? {} : { email: values.email, mobile: values.mobile }),
            userType: values.userType,
            ...(values.password && !isEdit ? { password: values.password } : {}),
            ...(values.image ? { image: values.image } : {}),
          };

          if (isEdit) {
            const changedFields = {};
            Object.keys(payload).forEach((key) => {
              if (key !== 'image' && JSON.stringify(payload[key]) !== JSON.stringify(editData[key])) {
                changedFields[key] = payload[key];
              }
            });
            if (payload.image) changedFields.image = payload.image;

            if (Object.keys(changedFields).length === 0) {
              setSubmitting(false);
              setSubmissionError('No changes detected. Please modify at least one field.');
              return;
            }

            onSubmit({ _id: editData._id, ...changedFields });
          } else {
            onSubmit(payload);
          }
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Box component="form">
            <DialogContent>
              {submissionError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submissionError}
                </Alert>
              )}
              {isSubmitting || loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : null}
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
                    inputProps={{ 'aria-required': true }}
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
                    inputProps={{ 'aria-required': true }}
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
                    inputProps={{ 'aria-required': true }}
                    disabled={isEdit}
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
                    inputProps={{ 'aria-required': true }}
                    disabled={isEdit}
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
                      inputProps={{ 'aria-required': true }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={touched.userType && Boolean(errors.userType)}>
                    <InputLabel id="userType-label">User Type *</InputLabel>
                    <Field
                      as={Select}
                      name="userType"
                      labelId="userType-label"
                      label="User Type *"
                      value={values.userType}
                      disabled={isEdit}
                      inputProps={{ 'aria-required': true }}
                    >
                      <MenuItem value="licensee">Licensee</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Field>
                    {touched.userType && errors.userType && (
                      <Typography color="error" variant="caption">{errors.userType}</Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="file"
                    label="Profile Image"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && !file.type.match(/image\/(jpg|jpeg|png)/)) {
                        setSubmissionError('Only JPG, JPEG, and PNG files are allowed');
                        return;
                      }
                      if (file && file.size > 5 * 1024 * 1024) {
                        setSubmissionError('File size must be less than 5MB');
                        return;
                      }
                      setFieldValue('image', file);
                    }}
                    fullWidth
                    variant="outlined"
                    inputProps={{ accept: 'image/jpeg,image/png,image/jpg', 'aria-label': 'Upload profile image' }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={onClose} variant="outlined">Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || loading}
                sx={{ ml: 2 }}
                onClick={() => document.activeElement.blur()}
              >
                {isSubmitting || loading ? 'Saving...' : isEdit ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Box>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEdit;