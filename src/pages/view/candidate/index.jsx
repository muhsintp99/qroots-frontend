import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCandidate,
  deleteCandidate,
  getCandidate,
  updateCandidate,
  blockCandidate,
  reactivateCandidate,
} from '../../container/candidate/slice';
import { StyledDataGrid } from '../../../assets/style/index';
import {
  DeleteOutlined,
  EyeOutlined,
  FormOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  BlockOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  Typography,
  Box,
  TextField,
  useMediaQuery,
  InputAdornment,
  Button,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../assets/style/commen';
import View from './view';
import AddEdit from './AddEdit';
import DeleteModel from '../../../utils/defult/DeleteModel';

const Index = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [resetForm, setResetForm] = useState(null);

  const dispatch = useDispatch();
  const { candidates, loading } = useSelector((state) => state.candidate || { candidates: [], loading: false });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = "Candidates";

  useEffect(() => {
    dispatch(getCandidate());
  }, [dispatch]);

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

  const handleBlock = (row) => {
    dispatch(blockCandidate(row._id));
  };

  const handleReactivate = (row) => {
    dispatch(reactivateCandidate(row._id));
  };

  const handleDeleteConfirm = (data) => {
    if (data && data._id) {
      dispatch(deleteCandidate(data._id));
      setOpenDeleteDialog(false);
      setDeleteData(null);
      dispatch(getCandidate());
    }
  };

  const handleSubmitForm = (values, { setSubmitting, resetForm }) => {
    console.log('Form Values:', values);

    const payload = {
      email: values.email,
      mobile: values.mobile,
      firstName: values.firstName,
      lastName: values.lastName,
      dob: values.dob,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      district: values.district,
      state: values.state,
      zipCode: values.zipCode,
      country: values.country,
      image: values.image || values.existingImage,
    };

    if (editData && editData._id) {
      dispatch(updateCandidate({ id: editData._id, data: payload }));
    } else {
      dispatch(addCandidate(payload));
    }

    dispatch(getCandidate());
    setSubmitting(false);
    resetForm();
    setOpenDialog(false);
    setEditData(null);
  };

  const rows = useMemo(() => {
    const validCandidates = Array.isArray(candidates) ? candidates : [];
    if (!Array.isArray(candidates)) {
      console.warn('Redux state.candidates is not an array:', candidates);
    }
    return validCandidates
      .filter((item) => !item.isDeleted)
      .filter((item) =>
        (item.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.canId || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((item, index) => ({
        ...item,
        id: index + 1 || item._id || '',
        fullName: `${item.firstName} ${item.lastName}`,
      }));
  }, [candidates, searchQuery]);

  const memoizedEditData = useMemo(() => editData, [editData]);

  const columns = [
    { field: 'id', headerName: 'S.No', flex: 0.4, align: 'center', headerAlign: 'center' },
    {
      field: 'image',
      headerName: 'Profile Image',
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
            <img
              src={params.value}
              alt="Candidate Profile"
              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
            />
          </Box>
        ) : (
          <Typography variant="body2">No Image</Typography>
        ),
    },
    { field: 'canId', headerName: 'Candidate ID', flex: 1 },
    { field: 'fullName', headerName: 'Full Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'mobile', headerName: 'Mobile', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.value || 'active'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <EyeOutlined
            style={pageStyles.viewIcon}
            onClick={() => handleView(params.row)}
          />
          <FormOutlined
            style={pageStyles.editIcon}
            onClick={() => handleEdit(params.row)}
          />
          <DeleteOutlined
            style={pageStyles.deleteIcon}
            onClick={() => handleDelete(params.row)}
          />
          {params.row.status === 'blocked' ? (
            <CheckCircleOutlined
              style={pageStyles.reactivateIcon}
              onClick={() => handleReactivate(params.row)}
            />
          ) : (
            <BlockOutlined
              style={pageStyles.blockIcon}
              onClick={() => handleBlock(params.row)}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <Box sx={pageStyles.mainBox}>
      <Typography variant="h4" sx={pageStyles.title}>{title}</Typography>
      <Typography component="p" sx={pageStyles.countList}>
        <span style={{ color: "#234155", fontWeight: 600 }}>{rows.length} {title}</span> are listed below
      </Typography>

      <Grid container spacing={2} sx={pageStyles.searchbox}>
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Name, Email, Candidate ID"
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
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={6} sx={pageStyles.newButtonBox}>
          <Button
            variant="contained"
            sx={pageStyles.newButton}
            fullWidth={isMobile}
            onClick={handleNewClick}
          >
            <PlusCircleOutlined style={pageStyles.newButtonIcon} />
            New
          </Button>
        </Grid>
      </Grid>

      {loading && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading candidates...
        </Typography>
      )}

      {!loading && rows.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No candidates found.
        </Typography>
      )}

      <StyledDataGrid
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        rows={rows}
        columns={columns}
        autoHeight
      />

      <AddEdit
        open={openDialog}
        onClose={() => {
          if (resetForm) resetForm();
          setOpenDialog(false);
          setEditData(null);
        }}
        onSubmit={handleSubmitForm}
        editData={memoizedEditData}
        resetFormCallback={(fn) => setResetForm(fn)}
      />

      <View
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={selectedRow}
      />

      <DeleteModel
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setDeleteData(null);
        }}
        data={deleteData}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default Index;