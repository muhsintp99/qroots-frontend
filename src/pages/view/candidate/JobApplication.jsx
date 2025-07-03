import React, { useState } from 'react';
import {
  Box, Button, Step, StepLabel, Stepper, Typography, TextField, MenuItem, InputLabel, Select, FormControl, Grid, Paper
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const steps = ['Personal Information', 'Educational Qualification', 'Job Preferences', 'Subscription'];

const validationSchemas = [
  Yup.object({
    fullName: Yup.string().required('Full name required'),
    email: Yup.string().email('Invalid email').required('Email required'),
    phone: Yup.string().required('Phone required'),
    address: Yup.string().required('Address required'),
    dateOfBirth: Yup.string().required('Date of Birth required'),
    gender: Yup.string().required('Gender required'),
    nationality: Yup.string().required('Nationality required'),
  }),
  Yup.object({
    degree: Yup.string().required('Degree required'),
    institution: Yup.string().required('Institution required'),
    yearOfPassing: Yup.number().required('Year required'),
    grade: Yup.string(),
    certifications: Yup.string(),
    skills: Yup.string(),
  }),
  Yup.object({
    preferredJobs: Yup.string().required('Preferred Job required'),
    preferredCountries: Yup.string().required('Preferred Country required'),
  }),
  Yup.object({
    package: Yup.string().required('Package required'),
  }),
];

const initialValues = {
  fullName: '', email: '', phone: '', address: '', dateOfBirth: '', gender: '', nationality: '', identityCard: null,
  degree: '', institution: '', yearOfPassing: '', grade: '', certifications: '', skills: '',
  preferredJobs: '', preferredCountries: '', package: '',
};

const JobApplication = () => {
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === steps.length - 1;

  const handleSubmit = (values) => {
    console.log('Final Submit Data:', values);
    // You can integrate your backend API here
  };

  const handleNext = (formik) => {
    formik.validateForm().then(errors => {
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
            <Grid item xs={12} sm={6}>
              <Field name="fullName" as={TextField} fullWidth label="Full Name" error={formik.touched.fullName && Boolean(formik.errors.fullName)} helperText={<ErrorMessage name="fullName" />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="email" as={TextField} fullWidth label="Email" error={formik.touched.email && Boolean(formik.errors.email)} helperText={<ErrorMessage name="email" />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="phone" as={TextField} fullWidth label="Phone" error={formik.touched.phone && Boolean(formik.errors.phone)} helperText={<ErrorMessage name="phone" />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="address" as={TextField} fullWidth label="Address" error={formik.touched.address && Boolean(formik.errors.address)} helperText={<ErrorMessage name="address" />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" name="dateOfBirth" label="Date of Birth" InputLabelProps={{ shrink: true }} value={values.dateOfBirth} onChange={handleChange} />
              <ErrorMessage name="dateOfBirth" component="div" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={values.gender} onChange={handleChange}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <ErrorMessage name="gender" component="div" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="nationality" as={TextField} fullWidth label="Nationality" error={formik.touched.nationality && Boolean(formik.errors.nationality)} helperText={<ErrorMessage name="nationality" />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Identity Card Upload</InputLabel>
              <input type="file" name="identityCard" onChange={(e) => setFieldValue('identityCard', e.currentTarget.files[0])} />
            </Grid>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Grid item xs={12} sm={6}>
              <Field name="degree" as={TextField} fullWidth label="Degree" error={formik.touched.degree && Boolean(formik.errors.degree)} helperText={<ErrorMessage name="degree" />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="institution" as={TextField} fullWidth label="Institution" error={formik.touched.institution && Boolean(formik.errors.institution)} helperText={<ErrorMessage name="institution" />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="yearOfPassing" as={TextField} fullWidth label="Year of Passing" error={formik.touched.yearOfPassing && Boolean(formik.errors.yearOfPassing)} helperText={<ErrorMessage name="yearOfPassing" />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="grade" as={TextField} fullWidth label="Grade" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="certifications" as={TextField} fullWidth label="Certifications (comma separated)" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="skills" as={TextField} fullWidth label="Skills (comma separated)" />
            </Grid>
          </>
        )}

        {activeStep === 2 && (
          <>
            <Grid item xs={12} sm={6}>
              <Field name="preferredJobs" as={TextField} fullWidth label="Preferred Jobs" error={formik.touched.preferredJobs && Boolean(formik.errors.preferredJobs)} helperText={<ErrorMessage name="preferredJobs" />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="preferredCountries" as={TextField} fullWidth label="Preferred Countries" error={formik.touched.preferredCountries && Boolean(formik.errors.preferredCountries)} helperText={<ErrorMessage name="preferredCountries" />} />
            </Grid>
          </>
        )}

        {activeStep === 3 && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Subscription Package</InputLabel>
              <Select name="package" value={values.package} onChange={handleChange}>
                <MenuItem value="Basic">Basic</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
              </Select>
            </FormControl>
            <ErrorMessage name="package" component="div" style={{ color: 'red' }} />
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <Box sx={{ width: '90%', mx: 'auto', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" mb={4} align="center">Job Application</Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <Formik initialValues={initialValues} validationSchema={validationSchemas[activeStep]} onSubmit={handleSubmit}>
          {(formik) => (
            <Form>
              <Box sx={{ mt: 4 }}>{getStepContent(formik)}</Box>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                {isLastStep
                  ? <Button variant="contained" type="submit">Submit</Button>
                  : <Button variant="contained" onClick={() => handleNext(formik)}>Next</Button>}
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default JobApplication;
