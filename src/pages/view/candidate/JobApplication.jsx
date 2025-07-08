import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  Grid,
  Paper,
  CircularProgress,
  FormLabel,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Chip
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addCandidate } from '../../container/candidate/slice';
import { getCountry } from '../../container/country/slice';
import { fromStar } from '../../../assets/style/commen';
import FileUpload from '../../../utils/uplode/FileUpload';
import { toast } from 'react-toastify';
import { getCertificates } from '../../container/certificate/slice';
import { getJobs } from '../../container/jobs/slice';
import { getPackages } from '../../container/package/slice';
import { getCoupons } from '../../container/couponCode/slice';
import { Stack } from '@mui/system';
import {
  BusinessCenter,
  LocationOn,
  WorkOutline,
  MonetizationOn,
  School,
  ListAlt
} from '@mui/icons-material';

const steps = ['Personal Information', 'Educational Qualification', 'Subscription'];

const validationSchemas = [
  Yup.object({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Invalid email').required('Email required'),
    mobile: Yup.string()
      .matches(/^\d{8,10}$/, 'Mobile number must be 8 to 10 digits')
      .required('Mobile number required'),
    addressLine1: Yup.string().required('Address Line 1 required'),
    addressLine2: Yup.string(),
    city: Yup.string().required('City required'),
    district: Yup.string(),
    state: Yup.string().required('State required'),
    zipCode: Yup.string().required('Zip code required'),
    country: Yup.string().required('Country required'),
    dateOfBirth: Yup.string().required('Date of Birth required'),
    gender: Yup.string().required('Gender required'),
    identityCard: Yup.mixed()
      .nullable()
      .test('fileType', 'Only image files (jpg, jpeg, png, gif) are allowed', (value) => {
        if (!value) return true;
        return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
      })
      .test('fileSize', 'Image size must be less than 5MB', (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024;
      }),
  }),
  Yup.object({
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
  }),
  Yup.object({
    package: Yup.string().required('Package required'),
    couponCode: Yup.string(),
  }),
];

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  district: '',
  state: '',
  zipCode: '',
  country: '',
  dateOfBirth: '',
  gender: '',
  identityCard: null,
  degree: '',
  institution: '',
  yearOfPassing: '',
  grade: '',
  certifications: '',
  skills: '',
  preferredJobs: '',
  preferredCountries: '',
  package: '',
  couponCode: '',
};

const JobApplication = () => {
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === steps.length - 1;
  const dispatch = useDispatch();

  // Redux state selectors
  const { certificates = [], loading: certLoading, error: certError } = useSelector(
    (state) => state.certificates || { certificates: [], loading: false, error: null }
  );
  const { countries = [], loading: countryLoading } = useSelector(
    (state) => state.country || { countries: [], loading: false }
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
  const { loading: candidateLoading, error: candidateError } = useSelector(
    (state) => state.candidate || { loading: false, error: null }
  );

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getCountry());
    dispatch(getCertificates());
    dispatch(getJobs());
    dispatch(getPackages());
    dispatch(getCoupons());
  }, [dispatch]);

  // Handle errors from Redux state
  useEffect(() => {
    if (certError) toast.error(certError);
    if (jobError) toast.error(jobError);
    if (couponError) toast.error(couponError);
    if (candidateError) toast.error(candidateError);
  }, [certError, jobError, couponError, candidateError]);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobile: values.mobile,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      district: values.district,
      state: values.state,
      zipCode: values.zipCode,
      country: values.country,
      dob: values.dateOfBirth,
      gender: values.gender.toLowerCase(),
      image: values.identityCard,
      educationDetails: [
        {
          qualification: values.degree,
          university: values.institution,
          passingYear: values.yearOfPassing,
          certificate: values.certifications,
        },
      ],
      preferredJob: values.preferredJobs,
      packageId: values.package,
      couponCode: values.couponCode || undefined,
    };

    dispatch(addCandidate(payload)).then((result) => {
      if (result.type.endsWith('fulfilled')) {
        resetForm();
        setActiveStep(0);
        toast.success('Candidate application submitted successfully');
      }
      setSubmitting(false);
    });
  };

  const handleNext = (formik) => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setActiveStep(activeStep + 1);
      } else {
        formik.setTouched(errors);
      }
    });
  };

  const handleBack = () => setActiveStep(activeStep - 1);

  const getStepContent = (formik) => {
    const { values, handleChange, setFieldValue } = formik;

    return (
      <Grid container spacing={2}>
        {activeStep === 0 && (
          <>
            <Grid item xs={12} sm={12}>
              <Typography variant='h4' mb={1}>Personal Details</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>First Name <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="firstName"
                placeholder="Enter your first name"
                fullWidth
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={<ErrorMessage name="firstName" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>Last Name <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="lastName"
                placeholder='Enter your last name'
                fullWidth
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={<ErrorMessage name="lastName" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>Date of Birth <span style={fromStar.star}>*</span></FormLabel>
              <TextField
                fullWidth
                type="date"
                name="dateOfBirth"
                placeholder="Select your date of birth"
                InputLabelProps={{ shrink: true }}
                value={values.dateOfBirth}
                onChange={handleChange}
                error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                helperText={<ErrorMessage name="dateOfBirth" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>Gender <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                select
                name="gender"
                placeholder="Select your gender"
                fullWidth
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={<ErrorMessage name="gender" />}
              >
                <MenuItem value="">Select your gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Field>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>Email <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="email"
                placeholder='Enter your email'
                fullWidth
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={<ErrorMessage name="email" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>Mobile <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="mobile"
                placeholder='Enter your mobile number'
                fullWidth
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={<ErrorMessage name="mobile" />}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography variant='h4' mb={1}>Address Details</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Address Line 1 <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="addressLine1"
                placeholder="Enter your Address Line 1"
                fullWidth
                error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)}
                helperText={<ErrorMessage name="addressLine1" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Address Line 2</FormLabel>
              <Field
                as={TextField}
                name="addressLine2"
                placeholder="Enter your Address Line 2"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>City <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="city"
                placeholder="Enter your city"
                fullWidth
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={<ErrorMessage name="city" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>District</FormLabel>
              <Field
                as={TextField}
                name="district"
                placeholder="Enter your district"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>State <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="state"
                placeholder="Enter your state"
                fullWidth
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={<ErrorMessage name="state" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>
                Country <span style={fromStar.star}>*</span>
              </FormLabel>

              <Field
                as={TextField}
                select
                name="country"
                fullWidth
                placeholder="Select your country"
                disabled={countryLoading}
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={<ErrorMessage name="country" />}
              >
                {countryLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : countries.length > 0 ? (
                  <>
                    <MenuItem value="" disabled>
                      Select country
                    </MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country._id} value={country._id}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </>
                ) : (
                  <MenuItem disabled>No countries available</MenuItem>
                )}
              </Field>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>Zip Code <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="zipCode"
                placeholder="Enter your zip code"
                fullWidth
                error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                helperText={<ErrorMessage name="zipCode" />}
              />
            </Grid>

            <Grid item xs={12} sm={12} style={fromStar.upload}>
              <FileUpload name="identityCard" label="Upload Identity Card" accept="image/*" />
              <ErrorMessage name="identityCard" component="div" style={{ color: 'red' }} />
            </Grid>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Grid item xs={12} sm={12}>
              <Typography variant='h4' mb={1}>Educational Qualification</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Degree <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="degree"
                placeholder="Enter your degree"
                fullWidth
                error={formik.touched.degree && Boolean(formik.errors.degree)}
                helperText={<ErrorMessage name="degree" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Institution <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="institution"
                placeholder="Enter your institution"
                fullWidth
                error={formik.touched.institution && Boolean(formik.errors.institution)}
                helperText={<ErrorMessage name="institution" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>Year of Passing <span style={fromStar.star}>*</span></FormLabel>
              <Field
                as={TextField}
                name="yearOfPassing"
                placeholder="Enter year of passing"
                type="number"
                fullWidth
                error={formik.touched.yearOfPassing && Boolean(formik.errors.yearOfPassing)}
                helperText={<ErrorMessage name="yearOfPassing" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>Grade</FormLabel>
              <Field
                as={TextField}
                name="grade"
                placeholder="Enter your grade"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>Skills</FormLabel>
              <Field
                as={TextField}
                name="skills"
                placeholder="Enter skills (comma separated)"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormLabel>Certifications</FormLabel>
              <Field
                as={TextField}
                select
                name="certifications"
                placeholder="Select your certifications"
                fullWidth
                disabled={certLoading}
              >
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
              </Field>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography variant='h4' mb={1}>Work Expirience</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Additional Qualifications</FormLabel>
              <Field
                as={TextField}
                name="additionalQualifications"
                placeholder="Enter additional qualifications"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Work Experience</FormLabel>
              <Field
                as={TextField}
                name="workExperience"
                placeholder="Enter work experience (comma separated)"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant='h4' mb={1}>Preferred Jobs</Typography>
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
                            <Typography variant="h4" fontWeight={700} gutterBottom color="primary.main">
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
              <FormLabel>Preferred Countries</FormLabel>
              <Field
                as={TextField}
                name="preferredCountries"
                placeholder="Enter preferred countries (comma separated)"
                fullWidth
                error={formik.touched.preferredCountries && Boolean(formik.errors.preferredCountries)}
                helperText={<ErrorMessage name="preferredCountries" />}
              />
            </Grid>
          </>
        )}

        {activeStep === 2 && (
          <>
            <Grid item xs={12} sm={12}>
              <Typography variant='h4' mb={1}>Subscription</Typography>
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
                            <Typography variant="h6">{pkg.name || pkg.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {pkg.description || 'No description available'}
                            </Typography>
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
              <FormLabel>Coupon Code</FormLabel>
              <Field
                as={TextField}
                select
                name="couponCode"
                placeholder="Select your coupon code"
                fullWidth
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
              </Field>
            </Grid>
          </>
        )}
      </Grid>
    );
  };

  return (
    <Box sx={{ width: '90%', mx: 'auto', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" mb={4} align="center">
          Job Application
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              <Box sx={{ mt: 4 }}>{getStepContent(formik)}</Box>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                {isLastStep ? (
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={candidateLoading || countryLoading || certLoading || jobLoading || packageLoading || couponLoading}
                  >
                    {candidateLoading ? <CircularProgress size={20} /> : 'Submit'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => handleNext(formik)}
                    disabled={countryLoading || certLoading || jobLoading || packageLoading || couponLoading}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default JobApplication;