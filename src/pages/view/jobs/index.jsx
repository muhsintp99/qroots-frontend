import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getJobs,
  addJob,
  updateJob,
  deleteJob,
} from '../../container/jobs/slice';
import { getCountry } from '../../container/country/slice';
import { getCertificates } from '../../container/certificate/slice';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { SearchOutlined, DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../assets/style/commen';
import AddEdit from './AddEdit';
import View from './view';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, jobId: null });

  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs || { jobs: [], loading: false, error: null });
  const { countries, loading: countryLoading, error: countryError } = useSelector((state) => state.country || { countries: [], loading: false, error: null });
  const { certificates, loading: certificateLoading, error: certificateError } = useSelector((state) => state.certificates || { certificates: [], loading: false, error: null });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = 'Jobs';

  useEffect(() => {
    console.log('Dispatching getJobs, getCountry, getCertificates');
    dispatch(getJobs());
    if (!countries.length && !countryLoading) {
      dispatch(getCountry());
    }
    if (!certificates.length && !certificateLoading) {
      dispatch(getCertificates());
    }
  }, [dispatch, countries.length, countryLoading, certificates.length, certificateLoading]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleOpenDialog = useCallback((job = null) => {
    setSelectedJob(job);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedJob(null);
  }, []);

  const handleView = useCallback((data) => {
    setViewData(data);
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
    [dispatch]
  );

  const handleSubmit = useCallback(
    (values) => {
      if (selectedJob && selectedJob._id) {
        dispatch(updateJob({ _id: selectedJob._id, ...values }));
      } else {
        dispatch(addJob(values));
      }
      handleCloseDialog();
    },
    [dispatch, selectedJob, handleCloseDialog]
  );

  const filteredJobs = useMemo(() => {
    const validJobs = Array.isArray(jobs)
      ? jobs.filter((item) => item && typeof item === 'object')
      : [];
    return validJobs.filter((item) => {
      const search = searchQuery.toLowerCase().trim();
      return (
        String(item.jobId || '').toLowerCase().includes(search) ||
        String(item.title || '').toLowerCase().includes(search) ||
        String(item.company || '').toLowerCase().includes(search) ||
        String(item.location || '').toLowerCase().includes(search) ||
        String(item.country?.name || '').toLowerCase().includes(search) ||
        String(item.certificate?.title || '').toLowerCase().includes(search) ||
        String(item.jobType || '').toLowerCase().includes(search) ||
        item.skills?.some((skill) =>
          String(skill || '').toLowerCase().includes(search)
        )
      );
    });
  }, [jobs, searchQuery]);

  return (
    <Box sx={pageStyles.mainBox}>
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
                <SearchOutlined style={pageStyles.newButtonIcon} />
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
        />
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{ mt: { xs: 2, sm: 0 }, ml: { sm: 2 } }}
        >
          Add Job
        </Button>
      </Box>

      {(loading || countryLoading || certificateLoading) && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading jobs...
        </Typography>
      )}

      {!loading && filteredJobs.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No jobs found.
        </Typography>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.jobId}>
            <Card sx={{ boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                      <Chip key={index} label={skill || 'N/A'} size="small" />
                    ))}
                    {job.skills.length > 3 && (
                      <Chip label={`+${job.skills.length - 3}`} size="small" />
                    )}
                  </Box>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-around', pb: 2 }}>
                <Button
                  size="small"
                  startIcon={<EyeOutlined />}
                  onClick={() => handleView(job)}
                >
                  View
                </Button>
                <Button
                  size="small"
                  startIcon={<EditOutlined />}
                  onClick={() => handleOpenDialog(job)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteOutlined />}
                  onClick={() => handleOpenDeleteDialog(job._id)}
                  color="error"
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
        certificates={certificates}
      />

      {viewData && (
        <View
          open={isViewOpen}
          onClose={handleViewClose}
          data={viewData}
        />
      )}

      <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete this job? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteDialog.jobId)} color="error">
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Index;