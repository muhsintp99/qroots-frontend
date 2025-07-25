import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
} from '../container/slice';
import { StyledDataGrid } from '../../../../assets/style/index';
import {
  DeleteOutlined,
  EyeOutlined,
  FormOutlined,
  PlusCircleOutlined,
  RedoOutlined,
  SearchOutlined,
  WarningFilled,
  UserDeleteOutlined
} from '@ant-design/icons';
import {
  Typography,
  Box,
  TextField,
  useMediaQuery,
  InputAdornment,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../../assets/style/commen';
import View from './view';
import AddEdit from './AddEdit';
import DeleteModel from '../../../../utils/defult/DeleteModel';

const capitalize = (str) => str?.toLowerCase()?.replace(/\b\w/g, (c) => c.toUpperCase()) || '';

const Index = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);
  const [openReactivateDialog, setOpenReactivateDialog] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deactivateData, setDeactivateData] = useState(null);
  const [reactivateData, setReactivateData] = useState(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [reactivateLoading, setReactivateLoading] = useState(false);

  const dispatch = useDispatch();
  const { users, userCount, loading } = useSelector((state) => state.users || { users: [], userCount: 0, loading: false });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = 'Licensee Users';

  useEffect(() => {
    dispatch(getUsers({ page: 1, limit: 10 }));
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

  const handleDeactivate = (row) => {
    setDeactivateData(row);
    setOpenDeactivateDialog(true);
  };

  const handleReactivate = (row) => {
    setReactivateData(row);
    setOpenReactivateDialog(true);
  };

  const handleDeleteConfirm = (data) => {
    if (data && data._id) {
      dispatch(deleteUser({ id: data._id, onClose: () => setOpenDeleteDialog(false) }));
      setDeleteData(null);
      dispatch(getUsers({ page: 1, limit: 10 }));
    }
  };

  const handleDeactivateConfirm = async () => {
    if (deactivateData && deactivateData._id) {
      setDeactivateLoading(true);
      try {
        await dispatch(deactivateUser({ id: deactivateData._id, onClose: () => setOpenDeactivateDialog(false) }));
        dispatch(getUsers({ page: 1, limit: 10 }));
      } finally {
        setDeactivateLoading(false);
        setDeactivateData(null);
      }
    }
  };

  const handleReactivateConfirm = async () => {
    if (reactivateData && reactivateData._id) {
      setReactivateLoading(true);
      try {
        await dispatch(reactivateUser({ id: reactivateData._id, onClose: () => setOpenReactivateDialog(false) }));
        dispatch(getUsers({ page: 1, limit: 10 }));
      } finally {
        setReactivateLoading(false);
        setReactivateData(null);
      }
    }
  };

  const handleSubmitForm = (values, { setSubmitting }) => {
    const payload = {
      fname: values.fname,
      lname: values.lname,
      email: values.email,
      mobile: values.mobile,
      password: values.password,
      image: values.image || values.existingImage,
      userType: 'licensee',
      onClose: () => {
        setOpenDialog(false);
        setEditData(null);
        dispatch(getUsers({ page: 1, limit: 10 }));
      },
    };

    if (editData && editData._id) {
      dispatch(updateUser({ _id: editData._id, ...payload }));
    } else {
      dispatch(addUser(payload));
    }
    setSubmitting(false);
  };

  // const rows = useMemo(() => {
  //   const validUsers = Array.isArray(users) ? users : [];
  //   if (!Array.isArray(users)) {
  //     console.warn('Redux state.users is not an array:', users);
  //   }
  //   return validUsers
  //     .filter(
  //       (item) =>
  //         (item.fname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         (item.lname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         (item.mobile || '').toLowerCase().includes(searchQuery.toLowerCase())
  //     )
  //     .map((item, index) => ({
  //       ...item,
  //       id: index + 1 || item._id || '',
  //     }));
  // }, [users, searchQuery]);

  const rows = useMemo(() => {
    const validUsers = Array.isArray(users) ? users : [];
    if (!Array.isArray(users)) {
      console.warn('Redux state.users is not an array:', users);
    }
    return validUsers
      .filter(
        (item) =>
          item && // Ensure item is defined
          (item.fname || item.lname || item.email || item.mobile) // Ensure at least one field exists
      )
      .filter(
        (item) =>
          (item.fname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.lname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.mobile || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((item, index) => ({
        ...item,
        id: index + 1 || item._id || '',
      }));
  }, [users, searchQuery]);

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
              alt="User"
              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
            />
          </Box>
        ) : (
          <Typography variant="body2">No Image</Typography>
        ),
    },
    { field: 'fname', headerName: 'First Name', flex: 1 },
    { field: 'lname', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'mobile', headerName: 'Mobile', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.value ? capitalize(params.value) : 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="View">
            <EyeOutlined
              style={pageStyles.viewIcon}
              onClick={() => handleView(params.row)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <FormOutlined
              style={pageStyles.editIcon}
              onClick={() => handleEdit(params.row)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              style={pageStyles.deleteIcon}
              onClick={() => handleDelete(params.row)}
            />
          </Tooltip>
          {params.row.status !== 'blocked' ? (
            <Tooltip title="Deactivate">
              <UserDeleteOutlined
                style={{ ...pageStyles.deleteIcon, color: 'gray' }}
                onClick={() => handleDeactivate(params.row)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Reactivate">
              <RedoOutlined
                style={{ ...pageStyles.deleteIcon, color: 'green' }}
                onClick={() => handleReactivate(params.row)}
              />
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  return (
    <Box sx={pageStyles.mainBox}>
      <Typography variant="h4" sx={pageStyles.title}>
        {title}
      </Typography>
      <Typography component="p" sx={pageStyles.countList}>
        <span style={{ color: '#234155', fontWeight: 600 }}>
          {userCount} {title}
        </span>{' '}
        are listed below
      </Typography>

      <Grid container spacing={2} sx={pageStyles.searchbox}>
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Name, Email, Mobile"
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
          Loading users...
        </Typography>
      )}

      {!loading && rows.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No users found.
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
          setOpenDialog(false);
          setEditData(null);
        }}
        onSubmit={handleSubmitForm}
        editData={memoizedEditData}
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

      <Dialog
        open={openDeactivateDialog}
        onClose={() => {
          setOpenDeactivateDialog(false);
          setDeactivateData(null);
        }}
        aria-labelledby="deactivate-dialog-title"
        aria-describedby="deactivate-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '400px',
            minWidth: '300px',
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
          },
        }}
      >
        <DialogTitle
          id="deactivate-dialog-title"
          sx={{
            fontWeight: 600,
            fontSize: '1.25rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <WarningFilled style={{color:'#f57c00', fontSize: '4rem', marginBottom: '8px'}} />
          Deactivate User?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="deactivate-dialog-description">
            Are you sure you want to deactivate{' '}
            <strong>
              {deactivateData?.fname} {deactivateData?.lname}
            </strong>
            ? This action can be reversed later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDeactivateDialog(false);
              setDeactivateData(null);
            }}
            sx={{
              ...pageStyles.cancelButton,
              color: '#666',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            disabled={deactivateLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeactivateConfirm}
            variant="contained"
            color="warning"
            sx={{
              ...pageStyles.deleteButton,
              backgroundColor: '#f57c00',
              '&:hover': {
                backgroundColor: '#e65100',
              },
            }}
            disabled={deactivateLoading}
          >
            {deactivateLoading ? 'Deactivating...' : 'Deactivate'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openReactivateDialog}
        onClose={() => {
          setOpenReactivateDialog(false);
          setReactivateData(null);
        }}
        aria-labelledby="reactivate-dialog-title"
        aria-describedby="reactivate-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '400px',
            minWidth: '300px',
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
          },
        }}
      >
        <DialogTitle
          id="reactivate-dialog-title"
          sx={{
            fontWeight: 600,
            fontSize: '1.25rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <WarningFilled style={{ color: '#2e7d32', fontSize: '4rem', marginBottom: '8px'}} />
          Reactivate User?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reactivate-dialog-description">
            Are you sure you want to reactivate{' '}
            <strong>
              {reactivateData?.fname} {reactivateData?.lname}
            </strong>
            ? This will restore their access.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenReactivateDialog(false);
              setReactivateData(null);
            }}
            sx={{
              ...pageStyles.cancelButton,
              color: '#666',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            disabled={reactivateLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReactivateConfirm}
            variant="contained"
            color="success"
            sx={{
              ...pageStyles.deleteButton,
              backgroundColor: '#2e7d32',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
            }}
            disabled={reactivateLoading}
          >
            {reactivateLoading ? 'Reactivating...' : 'Reactivate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Index;