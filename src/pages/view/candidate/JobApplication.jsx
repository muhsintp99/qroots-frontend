import React, { useState, useEffect } from 'react';
import { Box, Button, Step, StepLabel, Stepper, Typography, Paper } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addCandidate } from '../../container/candidate/slice';
import { getCountry } from '../../container/country/slice';
import { toast } from 'react-toastify';
import { getCertificates } from '../../container/certificate/slice';
import { getJobs } from '../../container/jobs/slice';
import { getPackages } from '../../container/package/slice';
import { getCoupons } from '../../container/couponCode/slice';
import { Stack } from '@mui/system';
import { isValid, parseISO, format } from 'date-fns';
import PersonalInformationStep from './jobApplication/PersonalInformationStep';
import EducationalQualificationStep from './jobApplication/EducationalQualificationStep';
import SubscriptionStep from './jobApplication/SubscriptionStep';


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
    landmark: Yup.string(),
    city: Yup.string().required('City required'),
    district: Yup.string(),
    state: Yup.string().required('State required'),
    zipCode: Yup.string().required('Zip code required'),
    country: Yup.string().required('Country required'),
    dateOfBirth: Yup.string()
      .required('Date of Birth required')
      .test('is-valid-date', 'Invalid date', (value) => {
        if (!value) return false;
        const parsedDate = parseISO(value);
        return isValid(parsedDate);
      }),
    gender: Yup.string().required('Gender required'),
    identityCard: Yup.mixed()
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
    additionalQualifications: Yup.string(),
    workExperience: Yup.string(),
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
  landmark: '',
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
  additionalQualifications: '',
  workExperience: '',
  package: '',
  couponCode: '',
};

const JobApplication = () => {
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === steps.length - 1;
  const dispatch = useDispatch();

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
  const { loading: candidateLoading, error: candidateError } = useSelector(
    (state) => state.candidate || { loading: false, error: null }
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
    if (candidateError) toast.error(candidateError);
    if (countryError) toast.error(countryError || 'Failed to load countries');
  }, [certError, jobError, couponError, candidateError, countryError]);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    formData.append('mobile', values.mobile);
    formData.append('addressLine1', values.addressLine1);
    formData.append('addressLine2', values.addressLine2 || '');
    formData.append('landmark', values.landmark || '');
    formData.append('city', values.city);
    formData.append('district', values.district || '');
    formData.append('state', values.state);
    formData.append('zipCode', values.zipCode);
    formData.append('country', values.country);
    formData.append('dob', values.dateOfBirth);
    formData.append('gender', values.gender.toLowerCase());

    const parsedDate = parseISO(values.dateOfBirth);
    const password = format(parsedDate, 'ddMMyyyy');
    formData.append('password', password);

    if (values.identityCard) {
      formData.append('image', values.identityCard);
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

    dispatch(addCandidate(formData)).then((result) => {
      if (result.type.endsWith('fulfilled')) {
        resetForm();
        setActiveStep(0);
        toast.success('Candidate registered successfully');
        dispatch(getJobs());
      } else {
        toast.error(result.error?.message || 'Failed to register candidate');
      }
      setSubmitting(false);
    });
  };

  const handleNext = (formik) => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setActiveStep(activeStep + 1);
      } else {
        formik.setTouched(
          Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
          true
        );
      }
    });
  };

  const handleBack = () => setActiveStep(activeStep - 1);

  const getStepContent = (formik) => {
    switch (activeStep) {
      case 0:
        return <PersonalInformationStep formik={formik} countries={countries} countryLoading={countryLoading} />;
      case 1:
        return <EducationalQualificationStep formik={formik} certificates={certificates} certLoading={certLoading} jobs={jobs} jobLoading={jobLoading} />;
      case 2:
        return <SubscriptionStep formik={formik} packages={packages} packageLoading={packageLoading} coupons={coupons} couponLoading={couponLoading} />;
      default:
        return null;
    }
  }

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