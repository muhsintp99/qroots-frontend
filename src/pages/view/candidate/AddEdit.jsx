import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Typography,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Card, CardActionArea, CardContent, Divider, Chip, Stack
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getCountry } from '../../container/country/slice';
import { getCertificates } from '../../container/certificate/slice';
import { getJobs } from '../../container/jobs/slice';
import { getPackages } from '../../container/package/slice';
import { getCoupons } from '../../container/couponCode/slice';
import { toast } from 'react-toastify';
import {
  BusinessCenter, LocationOn, WorkOutline, MonetizationOn, School, ListAlt
} from '@mui/icons-material';
import { fromStar } from '../../../assets/style/commen';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email required'),
  mobile: Yup.string().matches(/^\d{8,10}$/, 'Mobile number must be 8 to 10 digits').required('Mobile number required'),
  firstName: Yup.string().required('First name required'),
  lastName: Yup.string().required('Last name required'),
  dob: Yup.string()
    .required('Date of Birth required')
    .matches(
      /^\d{2}[-\/]\d{2}[-\/]\d{4}$/,
      'Date of Birth must be in DD/MM/YYYY or DD-MM-YYYY format'
    ),
  addressLine1: Yup.string().required('Address Line 1 required'),
  addressLine2: Yup.string(),
  landmark: Yup.string(),
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
  degree: Yup.string().required('Degree required'),
  institution: Yup.string().required('Institution required'),
  yearOfPassing: Yup.number()
    .required('Year required')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  grade: Yup.string(),
  certifications: Yup.string(),
  skills: Yup.string(),
  preferredJobs: Yup.string().required('Preferred Job required'),
  preferredCountries: Yup.string(),
  additionalQualifications: Yup.string(),
  workExperience: Yup.string(),
  package: Yup.string().required('Package required'),
  couponCode: Yup.string(),
});

const AddEdit = ({ open, onClose, onSubmit, editData, resetFormCallback }) => {
  const formikRef = useRef();
  const isEdit = Boolean(editData && editData._id);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileError, setFileError] = useState(null);
  const dispatch = useDispatch();

  // Redux state selectors
  const { certificates = [], loading: certLoading, error: certError } = useSelector(
    (state) => state.certificates || { certificates: [], loading: false, error: null }
  );
  const { countries = [], loading: countryLoading, error: countryError } = useSelector(
    (state) => state.country || { countries: [], loading: false, error: null }
  );
  const { jobs = [], loading: jobLoading, error: jobError } = useSelector(
    (state) => state.jobs || { jobs: [], loading: false, error: null }
  );
  const { packages = [], loading: packageLoading } = useSelector(
    (state) => state.packages || { packages: [], loading: false }
  );
  const { coupons = [], loading: couponLoading, error: couponError } = useSelector(
    (state) => state.coupons || { coupons: [], loading: false, error: null }
  );

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getCertificates());
    dispatch(getJobs());
    dispatch(getPackages());
    dispatch(getCoupons());
  }, [dispatch]);

  useEffect(() => {
    if (certError) toast.error(certError);
    if (jobError) toast.error(jobError);
    if (couponError) toast.error(couponError);
    if (countryError) toast.error(countryError || 'Failed to load countries');
  }, [certError, jobError, couponError, countryError]);

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
    return () => {
      if (resetFormCallback) {
        resetFormCallback(null);
      }
    };
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
    landmark: editData?.landmark || '',
    city: editData?.city || '',
    district: editData?.district || '',
    state: editData?.state || '',
    zipCode: editData?.zipCode || '',
    country: editData?.country || '',
    gender: editData?.gender || '',
    image: null,
    existingImage: editData?.image || null,
    degree: editData?.educationDetails?.[0]?.qualification || '',
    institution: editData?.educationDetails?.[0]?.university || '',
    yearOfPassing: editData?.educationDetails?.[0]?.passingYear || '',
    grade: editData?.educationDetails?.[0]?.grade || '',
    certifications: editData?.educationDetails?.[0]?.certificate || '',
    skills: editData?.educationDetails?.[0]?.skills || '',
    preferredJobs: editData?.preferredJob || '',
    preferredCountries: editData?.preferredCountries || '',
    additionalQualifications: editData?.educationDetails?.[0]?.additionalQualifications || '',
    workExperience: editData?.educationDetails?.[0]?.workExperience || '',
    package: editData?.packageId || '',
    couponCode: editData?.couponCode || '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('mobile', values.mobile);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('dob', values.dob);
    
    // Generate password from DOB (e.g., 17/12/1999 -> 17121999)
    const password = values.dob.replace(/[-\/]/g, '');
    formData.append('password', password);
    
    formData.append('addressLine1', values.addressLine1);
    formData.append('addressLine2', values.addressLine2 || '');
    formData.append('landmark', values.landmark || '');
    formData.append('city', values.city);
    formData.append('district', values.district || '');
    formData.append('state', values.state);
    formData.append('zipCode', values.zipCode);
    formData.append('country', values.country);
    formData.append('gender', values.gender.toLowerCase());
    if (values.image) {
      formData.append('image', values.image);
    }
    formData.append('educationDetails', JSON.stringify([{
      qualification: values.degree,
      university: values.institution,
      passingYear: values.yearOfPassing,
      certificate: values.certifications,
      grade: values.grade,
      skills: values.skills,
      additionalQualifications: values.additionalQualifications,
      workExperience: values.workExperience,
    }]));
    formData.append('preferredJob', values.preferredJobs);
    formData.append('packageId', values.package);
    if (values.couponCode) {
      formData.append('couponCode', values.couponCode);
    }
    formData.append('preferredCountries', values.preferredCountries);

    onSubmit(formData, { setSubmitting, resetForm: () => formikRef.current.resetForm() });
    setPreviewImage(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isSubmitting, handleChange }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Personal Details */}
                <Grid item xs={12}>
                  <Typography variant="h6">Personal Details</Typography>
                </Grid>
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
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                    <ErrorMessage name="gender" component="div" style={{ color: 'red' }} />
                  </FormControl>
                </Grid>
                {/* Address Details */}
                <Grid item xs={12}>
                  <Typography variant="h6">Address Details</Typography>
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
                    name="landmark"
                    label="Landmark"
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
                  <FormControl fullWidth>
                    <InputLabel>Country *</InputLabel>
                    <Select
                      name="country"
                      value={values.country}
                      onChange={(e) => setFieldValue('country', e.target.value)}
                      error={touched.country && Boolean(errors.country)}
                      disabled={countryLoading}
                    >
                      <MenuItem value="">
                        <em>Select Country</em>
                      </MenuItem>
                      {countryLoading ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} />
                        </MenuItem>
                      ) : countries.length > 0 ? (
                        countries.sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
                          <MenuItem key={country._id} value={country._id}>
                            {country.image && (
                              <img
                                src={country.image}
                                alt={country.name}
                                style={{ width: 24, height: 16, marginRight: 8, objectFit: 'cover', verticalAlign: 'middle' }}
                              />
                            )}
                            {country.name} {country.code ? `(${country.code})` : ''}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No countries available</MenuItem>
                      )}
                    </Select>
                    <ErrorMessage name="country" component="div" style={{ color: 'red' }} />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
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
                {/* Educational Details */}
                <Grid item xs={12}>
                  <Typography variant="h6">Educational Qualification</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="degree"
                    label="Degree *"
                    fullWidth
                    variant="outlined"
                    error={touched.degree && Boolean(errors.degree)}
                    helperText={touched.degree && errors.degree}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="institution"
                    label="Institution *"
                    fullWidth
                    variant="outlined"
                    error={touched.institution && Boolean(errors.institution)}
                    helperText={touched.institution && errors.institution}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="yearOfPassing"
                    label="Year of Passing *"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={touched.yearOfPassing && Boolean(errors.yearOfPassing)}
                    helperText={touched.yearOfPassing && errors.yearOfPassing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="grade"
                    label="Grade"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="skills"
                    label="Skills"
                    placeholder="Enter skills (comma separated)"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Certifications</InputLabel>
                    <Select
                      name="certifications"
                      value={values.certifications}
                      onChange={handleChange}
                      disabled={certLoading}
                    >
                      <MenuItem value="">
                        <em>Select Certification</em>
                      </MenuItem>
                      {certLoading ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} />
                        </MenuItem>
                      ) : certificates.length > 0 ? (
                        certificates.map((cert) => (
                          <MenuItem key={cert._id} value={cert._id}>
                            {cert.name || cert.title}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No certifications available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Work Experience</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="additionalQualifications"
                    label="Additional Qualifications"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="workExperience"
                    label="Work Experience"
                    placeholder="Enter work experience (comma separated)"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                {/* Preferred Jobs */}
                <Grid item xs={12}>
                  <Typography variant="h6">Preferred Jobs</Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormLabel>Preferred Job <span style={fromStar.star}>*</span></FormLabel>
                  <Grid container spacing={2}>
                    {jobLoading ? (
                      <Grid item xs={12}>
                        <CircularProgress size={20} />
                      </Grid>
                    ) : jobs.length > 0 ? (
                      jobs.map((job) => (
                        <Grid item xs={12} sm={6} md={4} key={job._id}>
                          <Card
                            sx={{
                              border: values.preferredJobs === job._id ? '2px solid #1976d2' : 'none',
                              backgroundColor: values.preferredJobs === job._id ? '#e3f2fd' : 'white'
                            }}
                          >
                            <CardActionArea
                              onClick={() => setFieldValue('preferredJobs', job._id)}
                              disabled={jobLoading}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
                                  {job.title || job.name}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                  <BusinessCenter fontSize="small" color="action" />
                                  <Typography variant="subtitle1" color="text.secondary">
                                    {job.company || 'N/A'}
                                  </Typography>
                                </Stack>
                                <Typography variant="body1" color="text.secondary" mb={2}>
                                  {job.description || 'No description available'}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Stack spacing={1}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOn fontSize="small" color="action" />
                                    <Typography variant="body2">
                                      <strong>Location:</strong> {job.location || 'N/A'}
                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <WorkOutline fontSize="small" color="action" />
                                    <Typography variant="body2">
                                      <strong>Job Type:</strong> {job.jobType || 'N/A'}
                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <MonetizationOn fontSize="small" color="action" />
                                    <Typography variant="body2">
                                      <strong>Salary:</strong> ₹{job.salary || 'N/A'}
                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <School fontSize="small" color="action" />
                                    <Typography variant="body2">
                                      <strong>Experience:</strong> {job.experience || 'N/A'}
                                    </Typography>
                                  </Stack>
                                </Stack>
                                {job.skills?.length > 0 && (
                                  <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" mb={1} fontWeight={600}>
                                      <ListAlt fontSize="small" sx={{ mr: 1 }} />
                                      Skills Required
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                      {job.skills.map((skill, index) => (
                                        <Chip
                                          key={index}
                                          label={skill}
                                          color="secondary"
                                          variant="outlined"
                                          size="small"
                                        />
                                      ))}
                                    </Box>
                                  </>
                                )}
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Typography>No jobs available</Typography>
                      </Grid>
                    )}
                  </Grid>
                  <ErrorMessage name="preferredJobs" component="div" style={{ color: 'red', marginTop: '8px' }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="preferredCountries"
                    label="Preferred Countries"
                    placeholder="Enter preferred countries (comma separated)"
                    fullWidth
                    variant="outlined"
                    error={touched.preferredCountries && Boolean(errors.preferredCountries)}
                    helperText={touched.preferredCountries && errors.preferredCountries}
                  />
                </Grid>
                {/* Subscription */}
                <Grid item xs={12}>
                  <Typography variant="h6">Subscription</Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormLabel>Subscription Package <span style={fromStar.star}>*</span></FormLabel>
                  <Grid container spacing={2}>
                    {packageLoading ? (
                      <Grid item xs={12}>
                        <CircularProgress size={20} />
                      </Grid>
                    ) : packages.length > 0 ? (
                      packages.map((pkg) => (
                        <Grid item xs={12} sm={6} md={4} key={pkg._id}>
                          <Card
                            sx={{
                              border: values.package === pkg._id ? '2px solid #1976d2' : 'none',
                              backgroundColor: values.package === pkg._id ? '#e3f2fd' : 'white'
                            }}
                          >
                            <CardActionArea
                              onClick={() => setFieldValue('package', pkg._id)}
                              disabled={packageLoading}
                            >
                              <CardContent>
                                <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
                                  {pkg.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {pkg.description}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  <strong>Package ID:</strong> {pkg.packId}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  <strong>Type:</strong> {pkg.type}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  <strong>Rate:</strong> ₹{pkg.rate}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  <strong>Status:</strong> {pkg.status}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  <strong>Active:</strong> {pkg.isActive ? 'Yes' : 'No'}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  <strong>Created At:</strong> {new Date(pkg.createdAt).toLocaleDateString()}
                                </Typography>
                                <Box mt={1}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    <strong>Points:</strong>
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                    {pkg.points && pkg.points.map((point, idx) => (
                                      <Chip key={idx} label={point} color="secondary" size="small" />
                                    ))}
                                  </Box>
                                </Box>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Typography>No packages available</Typography>
                      </Grid>
                    )}
                  </Grid>
                  <ErrorMessage name="package" component="div" style={{ color: 'red', marginTop: '8px' }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Coupon Code</InputLabel>
                    <Select
                      name="couponCode"
                      value={values.couponCode}
                      onChange={handleChange}
                      disabled={couponLoading}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {couponLoading ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} />
                        </MenuItem>
                      ) : coupons.length > 0 ? (
                        coupons.map((coupon) => (
                          <MenuItem key={coupon._id} value={coupon._id}>
                            {coupon.code || coupon.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No coupons available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
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