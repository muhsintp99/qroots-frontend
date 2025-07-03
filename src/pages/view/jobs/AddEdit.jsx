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
  title: Yup.string().required('Job title is required'),
  description: Yup.string().required('Description is required'),
  company: Yup.string().required('Company is required'),
  location: Yup.string().required('Location is required'),
  country: Yup.string().required('Country is required'),
  certificate: Yup.string().required('Certificate is required'),
  salary: Yup.number().positive('Salary must be positive'),
  jobType: Yup.string().required('Job type is required'),
  experience: Yup.string(),
  skills: Yup.array()
    .of(Yup.string().trim().min(1, 'Skill cannot be empty'))
    .max(MAX_SKILLS, `Maximum ${MAX_SKILLS} skills allowed`),
  isActive: Yup.boolean().required('Status is required'),
});

const AddEdit = ({ open, onClose, onSubmit, editData }) => {
  const isEdit = Boolean(editData && editData._id);
  const dispatch = useDispatch();
  const { countries, loading: countryLoading, error: countryError } = useSelector((state) => state.country || { countries: [], loading: false, error: null });
  const { certificates, loading: certificateLoading, error: certificateError } = useSelector((state) => state.certificates || { certificates: [], loading: false, error: null });
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    if (open && !countries.length && !countryLoading) {
      dispatch(getCountry());
    }
    if (open && !certificates.length && !certificateLoading) {
      dispatch(getCertificates());
    }
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

  const isCertificateValid = editData?.certificate?._id && certificates.some(c => c._id === editData.certificate._id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableEnforceFocus
    >
      <DialogTitle>{isEdit ? 'Edit Job' : 'Add New Job'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={true}
        onSubmit={(values, { setSubmitting }) => {
          setSubmissionError(null);
          const cleanedSkills = (values.skills || [])
            .map(skill => skill.trim().toLowerCase())
            .filter((skill, index, self) => skill && self.indexOf(skill) === index);

          const payload = {
            title: values.title,
            description: values.description,
            company: values.company,
            location: values.location,
            country: values.country,
            certificate: values.certificate,
            salary: values.salary ? Number(values.salary) : null,
            jobType: values.jobType,
            experience: values.experience || null,
            skills: cleanedSkills,
            isActive: values.isActive,
          };

          if (isEdit) {
            const changedFields = {};
            Object.keys(payload).forEach((key) => {
              const newValue = payload[key];
              const oldValue = editData[key];
              if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                changedFields[key] = newValue;
              }
            });

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
          <Form>
            <DialogContent>
              {submissionError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submissionError}
                </Alert>
              )}
              {countryError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Error loading countries: {countryError}
                </Alert>
              )}
              {certificateError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Error loading certificates: {certificateError}
                </Alert>
              )}
              {isEdit && editData?.certificate?._id && !isCertificateValid && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Selected certificate is invalid or no longer available. Please select a new certificate.
                </Alert>
              )}
              {!countryLoading && countries.length === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  No countries available. Please try again later.
                </Alert>
              )}
              {!certificateLoading && certificates.length === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  No certificates available. Please add a certificate first.
                </Alert>
              )}
              {(isSubmitting || countryLoading || certificateLoading) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <CircularProgress size={24} />
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
                    >
                      <MenuItem value=""><em>{countryLoading ? 'Loading countries...' : 'Select a country'}</em></MenuItem>
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
                    >
                      <MenuItem value=""><em>{certificateLoading ? 'Loading certificates...' : 'Select a certificate'}</em></MenuItem>
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
                      if (newValue.length <= MAX_SKILLS) {
                        setFieldValue('skills', newValue);
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
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Skills"
                        placeholder="Add skills (press Enter to add)"
                        error={touched.skills && Boolean(errors.skills)}
                        helperText={
                          touched.skills && errors.skills
                            ? errors.skills
                            : `Type a skill and press Enter (max ${MAX_SKILLS})`
                        }
                      />
                    )}
                  />
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
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Field>
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
                disabled={isSubmitting || countryLoading || certificateLoading || certificates.length === 0}
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