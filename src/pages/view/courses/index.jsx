import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCourse,
  deleteCourse,
  getCourse,
  updateCourse
} from '../../container/courses/slice';
import { StyledDataGrid } from '../../../assets/style/index';
import {
  DeleteOutlined,
  EyeOutlined,
  FormOutlined,
  PlusCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Typography,
  Box,
  TextField,
  useMediaQuery,
  InputAdornment,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../assets/style/commen';
import View from './view';
import AddEdit from './AddEdit';
import DeleteModel from '../../../utils/defult/DeleteModel';
import { format } from 'date-fns';

const Index = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const dispatch = useDispatch();
  const { courses, loading, error, message } = useSelector((state) => state.courses || { courses: [], loading: false, error: null, message: null });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = "Courses";

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Graduate', label: 'Graduate' },
    { value: 'Postgraduate', label: 'Postgraduate' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'PhD', label: 'PhD' },
    { value: 'other', label: 'Other' }
  ];

  const modeOptions = [
    { value: '', label: 'All Modes' },
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  useEffect(() => {
    if (!courses.length && !loading) {
      dispatch(getCourse());
    }
  }, [dispatch, courses.length, loading]);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesTitle = course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        const matchesCategory = categoryFilter ? course?.category?.toLowerCase() === categoryFilter.toLowerCase() : true;
        const matchesMode = modeFilter ? course?.mode === modeFilter : true;
        return matchesTitle && matchesCategory && matchesMode;
      })
      .map((course, index) => ({
        ...course,
        index: index + 1,
      }));
  }, [courses, searchQuery, categoryFilter, modeFilter]);


  const handleView = (row) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleNewClick = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setOpenDialog(true);
  };

  const handleDelete = (row) => {
    setDeleteData(row);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = (data) => {
    if (editData) {
      dispatch(updateCourse({ ...editData, ...data, id: editData._id }));
    } else {
      dispatch(addCourse(data));
    }
    setOpenDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteData(null);
  };

  const columns = [
    {
      field: 'index',
      headerName: 'No.',
      flex: 0.3,
      minWidth: 50,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 40,
      renderCell: (params) => params.value || 'N/A'
    },
    {
      field: 'duration',
      headerName: 'Duration',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => params.value || 'N/A'
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : 'N/A'
    },
    {
      field: 'mode',
      headerName: 'Mode',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : 'N/A'
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.value ? format(new Date(params.value), 'PPP') : 'N/A'
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.value ? format(new Date(params.value), 'PPP') : 'N/A'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box>
          <EyeOutlined
            onClick={() => handleView(params.row)}
            // style={{ cursor: 'pointer', color: theme.palette.primary.main }}
            style={pageStyles.viewIcon}
          />
          <FormOutlined
            onClick={() => handleEdit(params.row)}
            // style={{ cursor: 'pointer', color: theme.palette.warning.main }}
            style={pageStyles.editIcon}
          />
          <DeleteOutlined
            onClick={() => handleDelete(params.row)}
            // style={{ cursor: 'pointer', color: theme.palette.error.main }}
            style={pageStyles.deleteIcon}
          />
        </Box>
      )
    }
  ];

  return (
    <Box sx={pageStyles.pageWrapper}>
      <Typography variant="h4" sx={pageStyles.title}>{title}</Typography>
      <Typography component="p" sx={pageStyles.countList} mb={1}>
        <span style={{ color: "#234155", fontWeight: 600 }}>
          {filteredCourses.length} {title}
        </span>{' '}
        are listed below
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2} display="flex" justifyContent="flex-end">
          <FormControl fullWidth>
            <InputLabel>Mode</InputLabel>
            <Select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              label="Mode"
            >
              {modeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<PlusCircleOutlined />}
            onClick={handleNewClick}
          >
            New Course
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : filteredCourses.length === 0 ? (
        <Typography>No courses available.</Typography>
      ) : (
        <StyledDataGrid
          rows={filteredCourses}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          disableSelectionOnClick
        />
      )}

      <View
        open={isDrawerOpen}
        data={selectedRow}
        onClose={() => setIsDrawerOpen(false)}
      />

      <AddEdit
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        editData={editData}
        onSubmit={handleSubmit}
      />

      <DeleteModel
        open={openDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        onConfirm={() => {
          dispatch(deleteCourse(deleteData._id));
          handleCloseDeleteDialog();
        }}
        title="Delete Course"
        message={`Are you sure you want to delete the course "${deleteData?.title || ''}"?`}
      />
    </Box>
  );
};

export default Index;