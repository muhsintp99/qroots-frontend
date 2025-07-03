import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getJobs,
  addJob,
  updateJob,
  deleteJob,
  getJobById,
} from '../../container/jobs/slice';
import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useMediaQuery,
  Chip,
  CircularProgress,
} from '@mui/material';
import { SearchOutlined, DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../assets/style/commen';
import AddEdit from './AddEdit';
import View from './view';
import { getCountry } from '../../container/country/slice';
import { getCertificates } from '../../container/certificate/slice';
import DeleteModel from '../../../utils/defult/DeleteModel';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, jobId: null });

  const dispatch = useDispatch();
  const { jobs = [], loading = false, error = null } = useSelector((state) => {
    if (!state.jobs) {
      console.error('Jobs slice is undefined in Redux store');
      return { jobs: [], loading: false, error: 'Redux store misconfigured: jobs slice missing' };
    }
    return state.jobs;
  });
  const { countries = [], loading: countryLoading = false, error: countryError = nul } = useSelector((state) => state.country || { countries: [], loading: false });
  const { certificates = [], loading: certificateLoading = false, error: certificateError = null } = useSelector((state) => state.certificates || {});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = 'Jobs';

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Dispatching getJobs');
    }
    dispatch(getJobs());
  }, [dispatch]);

  useEffect(() => {
    if (!countries.length && !countryLoading) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Dispatching getCountries');
      }
      dispatch(getCountry());
    }
  }, [dispatch, countries.length, countryLoading]);

  useEffect(() => {
    if (!certificates.length && !certificateLoading) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Dispatching getCertificates');
      }
      dispatch(getCertificates());
    }
  }, [dispatch, certificates.length, certificateLoading]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value.trim());
  }, []);

  const handleOpenDialog = useCallback((job = null) => {
    setSelectedJob(job);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedJob(null);
  }, []);

  const handleView = useCallback((job) => {
    setViewData(job);
    setIsViewOpen(true);
  }, []);

  const handleViewClose = useCallback(() => {
    setIsViewOpen(false);
    setViewData(null);
  }, []);

 const handleOpenDeleteDialog = useCallback((jobId) => {
    setDeleteDialog({ open: true, jobId });
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialog({ open: false, jobId: null });
  }, []);

  const handleDelete = useCallback(
    (jobId) => {
      dispatch(deleteJob(jobId));
      handleCloseDeleteDialog();
    },
    [dispatch, handleCloseDeleteDialog]
  );

  const handleSubmit = useCallback(
    (values) => {
      if (selectedJob && selectedJob.jobId) {
        dispatch(updateJob({ jobId: selectedJob.jobId, ...values }));
      } else {
        dispatch(addJob(values));
      }
      handleCloseDialog();
    },
    [dispatch, selectedJob, handleCloseDialog]
  );

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    const search = searchQuery.toLowerCase().trim();
    return jobs.filter((item) => {
      if (!item || typeof item !== 'object') return false;
      return (
        (item.jobId || '').toLowerCase().includes(search) ||
        (item.title || '').toLowerCase().includes(search) ||
        (item.company || '').toLowerCase().includes(search) ||
        (item.location || '').toLowerCase().includes(search) ||
        (item.country?.name || '').toLowerCase().includes(search) ||
        (item.certificate?.title || '').toLowerCase().includes(search) ||
        (item.jobType || '').toLowerCase().includes(search) ||
        (item.skills || []).some((skill) => (skill || '').toLowerCase().includes(search))
      );
    });
  }, [jobs, searchQuery]);

  return (
    <Box sx={pageStyles.mainBox} role="main" aria-label="Job Listings">
      <Typography variant="h4" sx={pageStyles.title}>{title}</Typography>
      <Typography component="p" sx={pageStyles.countList}>
        <span style={{ color: '#234155', fontWeight: 600 }}>{filteredJobs.length} {title}</span> are listed below
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2, p: 2, backgroundColor: '#ffebee' }}>
          Error: {error}
        </Typography>
      )}
      {countryError && (
        <Typography variant="body2" color="error" sx={{ mt: 2, p: 2, backgroundColor: '#ffebee' }}>
          Error loading countries: {countryError}
        </Typography>
      )}
      {certificateError && (
        <Typography variant="body2" color="error" sx={{ mt: 2, p: 2, backgroundColor: '#ffebee' }}>
          Error loading certificates: {certificateError}
        </Typography>
      )}

      <Box sx={pageStyles.searchbox}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Job ID, Title, Company, Location, Country, Certificate, Job Type, or Skill"
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchOutlined style={pageStyles.newButtonIcon} aria-hidden="true" />
              </InputAdornment>
            ),
          }}
          sx={{
            ...pageStyles.searchInput,
            maxHeight: 35,
            '& .MuiOutlinedInput-root': {
              height: 35,
              fontSize: '14px',
            },
            '& .MuiInputBase-input': {
              padding: '8px 12px',
            },
          }}
          aria-label="Search jobs"
        />
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          sx={{ mt: { xs: 2, sm: 0 }, ml: { sm: 2 } }}
          aria-label="Add new job"
        >
          Add Job
        </Button>
      </Box>

      {(loading || countryLoading || certificateLoading) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress aria-label="Loading jobs" />
        </Box>
      )}

      {!loading && filteredJobs.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2 }} aria-live="polite">
          No jobs found.
        </Typography>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.jobId}>
            <Card sx={{ boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column' }} aria-label={`Job: ${job.title || 'N/A'}`}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5">{job.title || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Job ID: {job.jobId || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Company: {job.company || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {job.location || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Country: {job.country?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Certificate: {job.certificate?.title || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Job Type: {job.jobType || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Salary: {job.salary ? `$${job.salary.toLocaleString()}` : 'N/A'}
                </Typography>
                {job.skills?.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <Chip key={index} label={skill || 'N/A'} size="small" aria-label={`Skill: ${skill || 'N/A'}`} />
                    ))}
                    {job.skills.length > 3 && (
                      <Chip label={`+${job.skills.length - 3}`} size="small" aria-label={`Additional skills: ${job.skills.length - 3}`} />
                    )}
                  </Box>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-around', pb: 2 }}>
                <Button
                  size="small"
                  startIcon={<EyeOutlined />}
                  onClick={() => handleView(job)}
                  aria-label={`View job ${job.title || 'details'}`}
                >
                  View
                </Button>
                <Button
                  size="small"
                  startIcon={<EditOutlined />}
                  onClick={() => handleOpenDialog(job)}
                  aria-label={`Edit job ${job.title || ''}`}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteOutlined />}
                  onClick={() => handleOpenDeleteDialog(job.jobId)}
                  color="error"
                  aria-label={`Delete job ${job.title || ''}`}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <AddEdit
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editData={selectedJob}
        countries={countries}
        certificates={certificates}
      />

      {viewData && (
        <View
          open={isViewOpen}
          onClose={handleViewClose}
          data={viewData}
        />
      )}

      <DeleteModel
        open={deleteDialog.open}
        handleClose={handleCloseDeleteDialog}
        onConfirm={() => {
          handleDelete(deleteDialog.jobId);
        }}
        title="Delete Job"
        data={filteredJobs.find((job) => job.jobId === deleteDialog.jobId)}
      />
    </Box>
  );
};

export default Index;