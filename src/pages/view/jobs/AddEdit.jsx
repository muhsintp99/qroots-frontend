import React, { useEffect, useState } from 'react';
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
  InputLabel,
  FormControl,
  Autocomplete,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getCountry } from '../../container/country/slice';
import { getCertificates } from '../../container/certificate/slice';

const MAX_SKILLS = 10;

const validationSchema = Yup.object({
  title: Yup.string().trim().min(1, 'Job title is required').required('Job title is required'),
  description: Yup.string().trim().min(1, 'Description is required').required('Description is required'),
  company: Yup.string().trim().min(1, 'Company is required').required('Company is required'),
  location: Yup.string().trim().min(1, 'Location is required').required('Location is required'),
  country: Yup.string().trim().min(1, 'Country is required').required('Country is required'),
  certificate: Yup.string().required('Certificate is required'),
  salary: Yup.number().min(0, 'Salary cannot be negative').nullable(),
  jobType: Yup.string().trim().min(1, 'Job type is required').required('Job type is required'),
  experience: Yup.string().trim().nullable(),
  skills: Yup.array()
    .of(Yup.string().trim().min(1, 'Skill cannot be empty'))
    .min(1, 'At least one skill is required')
    .max(MAX_SKILLS, `Maximum ${MAX_SKILLS} skills allowed`),
  isActive: Yup.boolean().required('Status is required'),
});

const AddEdit = ({ open, onClose, onSubmit, editData, countries, certificates }) => {
  const isEdit = Boolean(editData && editData.jobId);
  const dispatch = useDispatch();
  const { loading: countryLoading = false, error: countryError = null } = useSelector((state) => state.countries || {});
  const { loading: certificateLoading = false, error: certificateError = null } = useSelector((state) => state.certificates || {});
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    if (open && !countries.length && !countryLoading) {
      dispatch(getCountry());
    }
    if (open && !certificates.length && !certificateLoading) {
      dispatch(getCertificates());
    }
    return () => {
      setSubmissionError(null);
    };
  }, [dispatch, open, countries.length, countryLoading, certificates.length, certificateLoading]);

  const initialValues = {
    title: editData?.title || '',
    description: editData?.description || '',
    company: editData?.company || '',
    location: editData?.location || '',
    country: editData?.country?._id || '',
    certificate: editData?.certificate?._id || '',
    salary: editData?.salary != null ? String(editData.salary) : '',
    jobType: editData?.jobType || 'Full-Time',
    experience: editData?.experience || '',
    skills: Array.isArray(editData?.skills) ? editData.skills : [],
    isActive: editData?.isActive !== undefined ? editData.isActive : true,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableEnforceFocus
      aria-labelledby={isEdit ? 'edit-job-dialog-title' : 'add-job-dialog-title'}
    >
      <DialogTitle id={isEdit ? 'edit-job-dialog-title' : 'add-job-dialog-title'}>
        {isEdit ? 'Edit Job' : 'Add New Job'}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={true}
        onSubmit={(values, { setSubmitting }) => {
          setSubmissionError(null);
          if (!values.certificate) {
            setSubmissionError('Please select a valid certificate.');
            setSubmitting(false);
            return;
          }
          const cleanedSkills = (values.skills || [])
            .map((skill) => skill.trim())
            .filter((skill, index, self) => skill && self.indexOf(skill) === index);

          const payload = {
            title: values.title.trim(),
            description: values.description.trim(),
            company: values.company.trim(),
            location: values.location.trim(),
            country: values.country,
            certificate: values.certificate,
            salary: values.salary ? Number(values.salary) : null,
            jobType: values.jobType,
            experience: values.experience?.trim() || null,
            skills: cleanedSkills,
            isActive: values.isActive,
          };

          if (process.env.NODE_ENV !== 'production') {
            console.log('Submitting payload:', payload);
          }

          if (isEdit) {
            const changedFields = {};
            Object.keys(payload).forEach((key) => {
              const newValue = payload[key];
              const oldValue = editData[key];
              if (Array.isArray(newValue) && Array.isArray(oldValue)) {
                if (newValue.length !== oldValue.length || newValue.some((v, i) => v !== oldValue[i])) {
                  changedFields[key] = newValue;
                }
              } else if (newValue !== oldValue) {
                changedFields[key] = newValue;
              }
            });

            if (Object.keys(changedFields).length === 0) {
              setSubmitting(false);
              setSubmissionError('No changes detected. Please modify at least one field.');
              return;
            }

            onSubmit({ jobId: editData.jobId, ...changedFields });
          } else {
            onSubmit(payload);
          }
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent>
              {submissionError && (
                <Alert severity="error" sx={{ mb: 2 }} aria-live="assertive">
                  {submissionError}
                </Alert>
              )}
              {countryError && (
                <Alert severity="error" sx={{ mb: 2 }} aria-live="assertive">
                  Error loading countries: {countryError}
                </Alert>
              )}
              {certificateError && (
                <Alert severity="error" sx={{ mb: 2 }} aria-live="assertive">
                  Error loading certificates: {certificateError}. Please try again or contact support.
                </Alert>
              )}
              {!countryLoading && countries.length === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }} aria-live="assertive">
                  No countries available. Please try again later or contact support.
                </Alert>
              )}
              {!certificateLoading && certificates.length === 0 && (
                <Alert severity="error" sx={{ mb: 2 }} aria-live="assertive">
                  No certificates available. Please add a certificate before creating a job.
                </Alert>
              )}
              {(isSubmitting || countryLoading || certificateLoading) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <CircularProgress size={24} aria-label="Loading form data" />
                </Box>
              )}
              <Grid container spacing={3}>
                {isEdit && (
                  <Grid item xs={12}>
                    <TextField
                      label="Job ID"
                      value={editData?.jobId || 'Generated on save'}
                      fullWidth
                      variant="outlined"
                      disabled
                      aria-readonly="true"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="title"
                    label="Job Title *"
                    fullWidth
                    variant="outlined"
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                    aria-required="true"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="company"
                    label="Company *"
                    fullWidth
                    variant="outlined"
                    error={touched.company && Boolean(errors.company)}
                    helperText={touched.company && errors.company}
                    aria-required="true"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="location"
                    label="Location *"
                    fullWidth
                    variant="outlined"
                    error={touched.location && Boolean(errors.location)}
                    helperText={touched.location && errors.location}
                    aria-required="true"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={touched.country && Boolean(errors.country)}>
                    <InputLabel id="country-label">Country *</InputLabel>
                    <Field
                      as={Select}
                      name="country"
                      labelId="country-label"
                      label="Country *"
                      value={values.country || ''}
                      onChange={(e) => setFieldValue('country', e.target.value)}
                      disabled={countryLoading}
                      aria-required="true"
                    >
                      <MenuItem value="">{countryLoading ? 'Loading countries...' : 'Select a country'}</MenuItem>
                      {countries.map((country) => (
                        <MenuItem key={country._id} value={country._id}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Field>
                    {countryLoading && <CircularProgress size={24} sx={{ position: 'absolute', right: 40, top: 20 }} />}
                    {touched.country && errors.country && (
                      <Typography color="error" variant="caption">
                        {errors.country}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={touched.certificate && Boolean(errors.certificate)}>
                    <InputLabel id="certificate-label">Certificate *</InputLabel>
                    <Field
                      as={Select}
                      name="certificate"
                      labelId="certificate-label"
                      label="Certificate *"
                      value={values.certificate || ''}
                      onChange={(e) => setFieldValue('certificate', e.target.value)}
                      disabled={certificateLoading || certificates.length === 0}
                      aria-required="true"
                    >
                      <MenuItem value="">{certificateLoading ? 'Loading certificates...' : 'Select a certificate'}</MenuItem>
                      {certificates.map((certificate) => (
                        <MenuItem key={certificate._id} value={certificate._id}>
                          {certificate.title}
                        </MenuItem>
                      ))}
                    </Field>
                    {certificateLoading && <CircularProgress size={24} sx={{ position: 'absolute', right: 40, top: 20 }} />}
                    {touched.certificate && errors.certificate && (
                      <Typography color="error" variant="caption">
                        {errors.certificate}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="salary"
                    label="Salary ($)"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={touched.salary && Boolean(errors.salary)}
                    helperText={touched.salary && errors.salary}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="jobType"
                    label="Job Type *"
                    fullWidth
                    variant="outlined"
                    select
                    error={touched.jobType && Boolean(errors.jobType)}
                    helperText={touched.jobType && errors.jobType}
                    aria-required="true"
                  >
                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                    <MenuItem value="Freelance">Freelance</MenuItem>
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="experience"
                    label="Experience"
                    fullWidth
                    variant="outlined"
                    error={touched.experience && Boolean(errors.experience)}
                    helperText={touched.experience && errors.experience}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="skills"
                    options={[]}
                    freeSolo
                    value={values.skills || []}
                    onChange={(event, newValue) => {
                      if (process.env.NODE_ENV !== 'production') {
                        console.log('Skills updated:', newValue);
                      }
                      if (newValue.length <= MAX_SKILLS) {
                        setFieldValue('skills', newValue);
                      } else {
                        setFieldValue('skills', newValue.slice(0, MAX_SKILLS));
                      }
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...chipProps } = getTagProps({ index });
                        return (
                          <Chip
                            key={key}
                            variant="outlined"
                            label={option}
                            {...chipProps}
                            aria-label={`Skill: ${option}`}
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Skills *"
                        placeholder="Type a skill and press Enter"
                        error={touched.skills && Boolean(errors.skills)}
                        helperText={
                          touched.skills && errors.skills
                            ? errors.skills
                            : `Type a skill and press Enter (max ${MAX_SKILLS}, ${values.skills?.length || 0}/${MAX_SKILLS})`
                        }
                        aria-describedby="skills-helper-text"
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && event.target.value && values.skills.length < MAX_SKILLS) {
                            const newSkill = event.target.value.trim();
                            if (newSkill && !values.skills.includes(newSkill)) {
                              setFieldValue('skills', [...values.skills, newSkill]);
                              if (process.env.NODE_ENV !== 'production') {
                                console.log('Added skill:', newSkill);
                              }
                            }
                            event.target.value = ''; // Clear input after adding
                          }
                        }}
                      />
                    )}
                  />
                  <Typography id="skills-helper-text" sx={{ display: 'none' }}>
                    {touched.skills && errors.skills
                      ? errors.skills
                      : `Type a skill and press Enter (max ${MAX_SKILLS}, ${values.skills?.length || 0}/${MAX_SKILLS})`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="description"
                    label="Description *"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    aria-required="true"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="isActive"
                    label="Status *"
                    fullWidth
                    variant="outlined"
                    select
                    error={touched.isActive && Boolean(errors.isActive)}
                    helperText={touched.isActive && errors.isActive}
                    aria-required="true"
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Field>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={onClose} variant="outlined" aria-label="Cancel form">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || countryLoading || certificateLoading || certificates.length === 0 || !values.certificate}
                sx={{ ml: 2 }}
                aria-label={isEdit ? 'Update job' : 'Add job'}
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