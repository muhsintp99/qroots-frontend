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
  MenuItem,
  Select,
  Chip,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getCountry } from '../../container/country/slice';
import { getCourse } from '../../container/courses/slice';

// Validation schema for college
const validationSchema = Yup.object({
  name: Yup.string().required('College name is required'),
  code: Yup.string().required('College code is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  website: Yup.string().url('Invalid URL').nullable(),
  desc: Yup.string().nullable(),
  country: Yup.string().required('Country is required'),
  category: Yup.string().required('Category is required'),
  status: Yup.string().required('Status is required'),
  image: Yup.mixed().nullable(),
  courses: Yup.array().of(Yup.string()).nullable(),
  facilities: Yup.array().of(Yup.string()).nullable(),
  services: Yup.array().of(Yup.string()).nullable(),
  map: Yup.string().nullable(),
  visible: Yup.boolean().nullable(),
});

const AddEdit = ({ open, onClose, onSubmit, editData }) => {
  const isEdit = Boolean(editData && editData._id);
  const dispatch = useDispatch();
  const { countries } = useSelector((state) => state.country);
  const { courses } = useSelector((state) => state.courses);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Fetch countries and courses when component mounts
    dispatch(getCountry());
    dispatch(getCourse());
  }, [dispatch]);

  useEffect(() => {
    if (editData?.image) {
      setPreviewImage(editData.image);
    } else {
      setPreviewImage(null);
    }
  }, [editData]);

  const initialValues = {
    name: editData?.name || '',
    code: editData?.code || '',
    email: editData?.email || '',
    phone: editData?.phone || '',
    address: editData?.address || '',
    website: editData?.website || '',
    desc: editData?.desc || '',
    country: editData?.country?._id || '',
    category: editData?.category || '',
    status: editData?.status || '',
    image: null,
    courses: editData?.courses?.map(course => course._id || course) || [], // Ensure course IDs
    facilities: editData?.facilities || [],
    services: editData?.services || [],
    map: editData?.map || '',
    visible: editData?.visible !== undefined ? editData.visible : true,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form submission values:', values);
    onSubmit({
      ...values,
      courses: values.courses.map(course => typeof course === 'object' ? course._id : course), // Extract _id
    });
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit College' : 'Add New College'}</DialogTitle>

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
                {/* College Name */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="College Name *"
                    fullWidth
                    variant="outlined"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                {/* College Code */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="code"
                    label="College Code *"
                    fullWidth
                    variant="outlined"
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                  />
                </Grid>

                {/* Email */}
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

                {/* Phone */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="phone"
                    label="Phone *"
                    fullWidth
                    variant="outlined"
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="address"
                    label="Address *"
                    fullWidth
                    variant="outlined"
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>

                {/* Website */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="website"
                    label="Website"
                    fullWidth
                    variant="outlined"
                    error={touched.website && Boolean(errors.website)}
                    helperText={touched.website && errors.website}
                  />
                </Grid>

                {/* Country */}
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
                    >
                      {countries.map((country) => (
                        <MenuItem key={country._id} value={country._id}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.country && errors.country && (
                      <Typography color="error" variant="caption">
                        {errors.country}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Category */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="category"
                    label="Category *"
                    fullWidth
                    variant="outlined"
                    select
                    error={touched.category && Boolean(errors.category)}
                    helperText={touched.category && errors.category}
                  >
                    <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                    <MenuItem value="Graduate">Graduate</MenuItem>
                    <MenuItem value="PhD">PhD</MenuItem>
                    <MenuItem value="Diploma">Diploma</MenuItem>
                  </Field>
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="status"
                    label="Status *"
                    fullWidth
                    variant="outlined"
                    select
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="recommended">Recommended</MenuItem>
                    <MenuItem value="popular">Popular</MenuItem>
                    <MenuItem value="regular">Regular</MenuItem>
                  </Field>
                </Grid>

                {/* Courses */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" error={touched.courses && Boolean(errors.courses)}>
                    <InputLabel id="courses-label">Courses</InputLabel>
                    <Field
                      as={Select}
                      name="courses"
                      labelId="courses-label"
                      label="Courses"
                      multiple
                      value={values.courses}
                      onChange={(e) => setFieldValue('courses', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((courseId) => {
                            const course = courses.find((c) => c._id === courseId);
                            return course ? <Chip key={courseId} label={course.title} /> : null;
                          })}
                        </Box>
                      )}
                    >
                      {courses.map((course) => (
                        <MenuItem key={course._id} value={course._id}>
                          {course.title}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.courses && errors.courses && (
                      <Typography color="error" variant="caption">
                        {errors.courses}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="desc"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    error={touched.desc && Boolean(errors.desc)}
                    helperText={touched.desc && errors.desc}
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      College Image
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue('image', file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPreviewImage(reader.result);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setPreviewImage(null);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                    />
                    {touched.image && errors.image && (
                      <Typography color="error" variant="caption">
                        {errors.image}
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
                        alt="College Preview"
                        style={{
                          width: 100,
                          height: 60,
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