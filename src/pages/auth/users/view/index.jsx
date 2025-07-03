import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, addUser, updateUser, deleteUser, reactivateUser, hardDeleteUser, clearError } from '../container/slice';
import {
  Typography, Box, TextField, InputAdornment, Grid, Card, CardContent, CardActions, Button,
  useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions,
  Divider
} from '@mui/material';
import { Search, Delete, Visibility, Edit, Restore } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from 'lodash';
import AddEdit from './AddEdit';
import View from './view';

const UserCard = React.memo(({ user, handleView, handleOpenDialog, handleOpenDeleteDialog, handleOpenReactivateDialog, handleOpenHardDeleteDialog, isAdmin }) => (
  <Card sx={{ boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      {user.image && (
        <Box sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
          <img src={user.image} alt="User profile" style={{ width: 80, height: 80, borderRadius: '50%' }} />
        </Box>
      )}
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 1 }}>{`${user.fname} ${user.lname}` || 'N/A'}</Typography>
      <Typography variant="body1" color="text.secondary">Email: {user.email || 'N/A'}</Typography>
      <Typography variant="body1" color="text.secondary">Mobile: {user.mobile || 'N/A'}</Typography>
      <Typography variant="body1" color="text.secondary">User Type: {user.userType || 'N/A'}</Typography>
      {/* <Typography variant="body2" color="text.secondary">Status: {user.status || 'N/A'}</Typography> */}

    </CardContent>
    <Divider />
    <CardActions sx={{ justifyContent: 'space-around', pb: 2 }}>
      <Button size="small" startIcon={<Visibility />} onClick={() => handleView(user)}>
        View
      </Button>
      <Button size="small" startIcon={<Edit />} onClick={() => handleOpenDialog(user)}>
        Edit
      </Button>
      {user.isDeleted ? (
        <Button
          size="small"
          startIcon={<Restore />}
          onClick={() => handleOpenReactivateDialog(user._id)}
          color="success"
        >
          Reactivate
        </Button>
      ) : (
        <>
          <Button
            size="small"
            startIcon={<Delete />}
            onClick={() => handleOpenDeleteDialog(user._id)}
            color="error"
          >
            Deactivate
          </Button>
          {isAdmin && (
            <Button
              size="small"
              startIcon={<Delete />}
              onClick={() => handleOpenHardDeleteDialog(user._id)}
              color="error"
              variant="outlined"
            >
              Delete Permanently
            </Button>
          )}
        </>
      )}
    </CardActions>
  </Card>
));

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });
  const [reactivateDialog, setReactivateDialog] = useState({ open: false, userId: null });
  const [hardDeleteDialog, setHardDeleteDialog] = useState({ open: false, userId: null });
  const [page, setPage] = useState(1);
  const limit = 10;

  const dispatch = useDispatch();
  const { users, loading, error, userCount } = useSelector((state) => state.users || { users: [], loading: false, error: null, userCount: 0 });
  const currentUser = useSelector((state) => state.auth?.user); // Assuming auth slice holds current user
  const isAdmin = currentUser?.userType === 'admin';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = 'Users';

  useEffect(() => {
    dispatch(getUsers({ page, limit }));
  }, [dispatch, page]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [error, dispatch]);

  const handleSearchChange = useCallback(
    debounce((e) => {
      setSearchQuery(e.target.value);
    }, 300),
    []
  );

  const handleOpenDialog = useCallback((user = null) => {
    setSelectedUser(user);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedUser(null);
  }, []);

  const handleView = useCallback((data) => {
    setViewData(data);
    setIsViewOpen(true);
  }, []);

  const handleViewClose = useCallback(() => {
    setIsViewOpen(false);
    setViewData(null);
  }, []);

  const handleOpenDeleteDialog = useCallback((userId) => {
    setDeleteDialog({ open: true, userId });
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialog({ open: false, userId: null });
  }, []);

  const handleOpenReactivateDialog = useCallback((userId) => {
    setReactivateDialog({ open: true, userId });
  }, []);

  const handleCloseReactivateDialog = useCallback(() => {
    setReactivateDialog({ open: false, userId: null });
  }, []);

  const handleOpenHardDeleteDialog = useCallback((userId) => {
    setHardDeleteDialog({ open: true, userId });
  }, []);

  const handleCloseHardDeleteDialog = useCallback(() => {
    setHardDeleteDialog({ open: false, userId: null });
  }, []);

  const handleDelete = useCallback((userId) => {
    dispatch(deleteUser(userId));
    handleCloseDeleteDialog();
  }, [dispatch]);

  const handleReactivate = useCallback((userId) => {
    dispatch(reactivateUser(userId));
    handleCloseReactivateDialog();
  }, [dispatch]);

  const handleHardDelete = useCallback((userId) => {
    dispatch(hardDeleteUser(userId));
    handleCloseHardDeleteDialog();
  }, [dispatch]);

  const handleSubmit = useCallback((values) => {
    if (selectedUser && selectedUser._id) {
      dispatch(updateUser({ _id: selectedUser._id, ...values }));
    } else {
      dispatch(addUser(values));
    }
    handleCloseDialog();
  }, [dispatch, selectedUser]);

  const filteredUsers = useMemo(() => {
    const validUsers = Array.isArray(users) ? users.filter((item) => item && typeof item === 'object') : [];
    return validUsers.filter((item) => {
      const search = searchQuery.toLowerCase().trim();
      const fullName = `${item.fname} ${item.lname}`.toLowerCase();
      return (
        fullName.includes(search) ||
        String(item.email || '').toLowerCase().includes(search) ||
        String(item.mobile || '').toLowerCase().includes(search) ||
        String(item.userType || '').toLowerCase().includes(search) ||
        String(item.status || '').toLowerCase().includes(search)
      );
    });
  }, [users, searchQuery]);

  const totalPages = Math.ceil(userCount / limit);

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>{title}</Typography>
      <Typography sx={{ mb: 3 }}>
        <span style={{ color: '#234155', fontWeight: 600 }}>{filteredUsers.length} {title}</span> are listed below
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2, p: 2, bgcolor: '#ffebee' }}>
          Error: {error.message}
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Name, Email, Mobile, User Type, or Status"
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mr: { sm: 2 }, mb: { xs: 2, sm: 0 } }}
          aria-label="Search users"
        />
        <Button variant="contained" sx={{ width: '200px' }} onClick={() => handleOpenDialog()}>
          Add User
        </Button>
      </Box>

      {loading && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading users...
        </Typography>
      )}

      {!loading && filteredUsers.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No users found.
        </Typography>
      )}

      <Grid container spacing={3}>
        {filteredUsers.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <UserCard
              user={user}
              handleView={handleView}
              handleOpenDialog={handleOpenDialog}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
              handleOpenReactivateDialog={handleOpenReactivateDialog}
              handleOpenHardDeleteDialog={handleOpenHardDeleteDialog}
              isAdmin={isAdmin}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2, alignSelf: 'center' }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </Box>
      )}

      <AddEdit
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editData={selectedUser}
      />

      {viewData && (
        <View
          open={isViewOpen}
          onClose={handleViewClose}
          data={viewData}
          loading={loading}
        />
      )}

      <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog} aria-labelledby="delete-dialog-title">
        <DialogTitle id="delete-dialog-title">Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to deactivate this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteDialog.userId)} color="error">
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={reactivateDialog.open} onClose={handleCloseReactivateDialog} aria-labelledby="reactivate-dialog-title">
        <DialogTitle id="reactivate-dialog-title">Confirm Reactivation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reactivate this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReactivateDialog}>Cancel</Button>
          <Button onClick={() => handleReactivate(reactivateDialog.userId)} color="success">
            Reactivate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={hardDeleteDialog.open} onClose={handleCloseHardDeleteDialog} aria-labelledby="hard-delete-dialog-title">
        <DialogTitle id="hard-delete-dialog-title">Confirm Permanent Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHardDeleteDialog}>Cancel</Button>
          <Button onClick={() => handleHardDelete(hardDeleteDialog.userId)} color="error">
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default Index;