import React from 'react';
import {
  Grid,
  FormLabel,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Chip,
  Box,
} from '@mui/material';

// MUI Icons
import BusinessCenter from '@mui/icons-material/BusinessCenter';
import LocationOn from '@mui/icons-material/LocationOn';
import WorkOutline from '@mui/icons-material/WorkOutline';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import School from '@mui/icons-material/School';
import ListAlt from '@mui/icons-material/ListAlt';
import { Field, ErrorMessage } from 'formik';
import { fromStar } from '../../../../assets/style/commen';

// Custom component for job selection
const JobSelection = ({ jobs, jobLoading, value, onChange, error, helperText }) => {
  return (
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
                border: value === job._id ? '2px solid #1976d2' : 'none',
                backgroundColor: value === job._id ? '#e3f2fd' : 'white',
              }}
            >
              <CardActionArea
                onClick={() => onChange(job._id)}
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
  );
};

const EducationalQualificationStep = ({ formik, certificates, certLoading, jobs, jobLoading }) => {
  const { values, handleChange, setFieldValue } = formik;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h4" mb={1}>Educational Qualification</Typography>
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
            value={values.certifications}
            onChange={handleChange}
            disabled={certLoading}
            error={formik.touched.certifications && Boolean(formik.errors.certifications)}
            helperText={<ErrorMessage name="certifications" />}
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
          <Typography variant="h4" mb={1}>Work Experience</Typography>
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
          <Typography variant="h4" mb={1}>Preferred Jobs</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormLabel>Preferred Job <span style={fromStar.star}>*</span></FormLabel>
          <JobSelection
            jobs={jobs}
            jobLoading={jobLoading}
            value={values.preferredJobs}
            onChange={(value) => setFieldValue('preferredJobs', value)}
            error={formik.touched.preferredJobs && Boolean(formik.errors.preferredJobs)}
            helperText={<ErrorMessage name="preferredJobs" />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabel>Preferred Countries</FormLabel>
          <Field
            as={TextField}
            name="preferredCountries"
            placeholder="Enter preferred countries (comma separated)"
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
};

export default EducationalQualificationStep;