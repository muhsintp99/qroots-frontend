import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getColleges,
  addCollege,
  updateCollege,
  deleteCollege,
  softDeleteCollege,
} from '../../container/colleges/slice';
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
  CardMedia,
} from '@mui/material';
import { SearchOutlined, DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../assets/style/commen';
import AddEdit from './AddEdit';
import View from './view';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const dispatch = useDispatch();
  const { colleges, loading, error } = useSelector((state) => state.college);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = 'Colleges';

  useEffect(() => {
    console.log('Dispatching getColleges');
    dispatch(getColleges());
  }, [dispatch]);

  useEffect(() => {
    console.log('Colleges state updated:', { colleges, loading, error });
  }, [colleges, loading, error]);

  const handleOpenDialog = (college = null) => {
    setSelectedCollege(college);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCollege(null);
  };

  const handleView = (data) => {
    setViewData(data);
    setIsViewOpen(true);
  };

  const handleViewClose = () => {
    setIsViewOpen(false);
    setViewData(null);
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, id: null });
  };

  const handleDelete = (id, isSoftDelete) => {
    if (isSoftDelete) {
      dispatch(softDeleteCollege(id));
    } else {
      dispatch(deleteCollege(id));
    }
    handleCloseDeleteDialog();
  };

  const handleSubmit = (values) => {
    if (selectedCollege && selectedCollege._id) {
      dispatch(updateCollege({ id: selectedCollege._id, ...values }));
    } else {
      dispatch(addCollege(values));
    }
    handleCloseDialog();
  };

  const filteredColleges = useMemo(() => {
    const validColleges = Array.isArray(colleges)
      ? colleges.filter((item) => item && typeof item === 'object')
      : [];
    console.log('Filtered colleges:', validColleges);
    return validColleges.filter((item) => {
      const search = searchQuery.toLowerCase();
      return (
        String(item.name || '').toLowerCase().includes(search) ||
        String(item.code || '').toLowerCase().includes(search) ||
        String(item.email || '').toLowerCase().includes(search) ||
        String(item.phone || '').toLowerCase().includes(search) ||
        String(item.address || '').toLowerCase().includes(search) ||
        String(item.country?.name || '').toLowerCase().includes(search) ||
        item.courses?.some((course) => String(course.title || '').toLowerCase().includes(search))
      );
    });
  }, [colleges, searchQuery]);

  return (
    <Box sx={pageStyles.mainBox}>
      <Typography variant="h4" sx={pageStyles.title}>{title}</Typography>
      <Typography component="p" sx={pageStyles.countList}>
        <span style={{ color: '#234155', fontWeight: 600 }}>{colleges.length} {title}</span> are listed below
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2, p: 2, backgroundColor: '#ffebee' }}>
          Error: {error}
        </Typography>
      )}

      <Box sx={pageStyles.searchbox}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Name, Code, Email, Phone, Address, Country, or Course"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          onClick={() => handleOpenDialog()}
          sx={{ mt: 2, ml: 2 }}
        >
          Add College
        </Button>
      </Box>

      {loading && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading colleges...
        </Typography>
      )}

      {!loading && filteredColleges.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No colleges found.
        </Typography>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {filteredColleges.map((college) => (
          <Grid item xs={12} sm={6} md={4} key={college._id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{college.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Code: {college.code}
                </Typography>
              </CardContent>
              <CardMedia
                sx={{ height: 140 ,padding:'0px 10px'}}
                image={college.image}
                component="img"
                title="College Image"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Email: {college.email || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {college.phone || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: {college.address || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Country: {college.country?.name || 'N/A'}
                </Typography>
              </CardContent>
              <CardActions sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                  size="small"
                  startIcon={<EyeOutlined />}
                  onClick={() => handleView(college)}
                >
                  View
                </Button>
                <Button
                  size="small"
                  startIcon={<EditOutlined />}
                  onClick={() => handleOpenDialog(college)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteOutlined />}
                  onClick={() => handleOpenDeleteDialog(college._id)}
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
        editData={selectedCollege}
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
          <Typography>Do you want to soft delete (mark as deleted) or permanently delete this college?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteDialog.id, true)} color="warning">
            Soft Delete
          </Button>
          <Button onClick={() => handleDelete(deleteDialog.id, false)} color="error">
            Permanent Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Index;