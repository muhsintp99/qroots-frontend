import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon
} from '../../container/couponCode/slice';
import { StyledDataGrid } from '../../../assets/style/index';
import {
  DeleteOutlined,
  EyeOutlined,
  FormOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  MoreOutlined
} from '@ant-design/icons';
import {
  Typography,
  Box,
  TextField,
  useMediaQuery,
  InputAdornment,
  Button,
  Grid,
  Alert,
  Skeleton,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../assets/style/commen';
import View from './View';
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector((state) => {
    const couponState = state.coupons || { coupons: [], loading: false, error: null };
    return couponState;
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = "Coupon Codes";

  useEffect(() => {
    dispatch(getCoupons());
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

  const handleDeleteConfirm = (data) => {
    if (data && data._id) {
      dispatch(deleteCoupon(data._id));
      setOpenDeleteDialog(false);
      setDeleteData(null);
    }
  };

  const handleSubmitForm = (values) => {
    const payload = {
      couponTitle: values.couponTitle || '',
      code: values.code?.toUpperCase() || '',
      discount: Number(values.discount) || 0,
      endDate: values.endDate ? new Date(values.endDate) : null,
      status: values.status || 'active'
    };

    if (editData && editData._id) {
      dispatch(updateCoupon({ id: editData._id, data: payload }));
    } else {
      dispatch(addCoupon(payload));
    }

    setOpenDialog(false);
    setEditData(null);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const rows = useMemo(() => {
    const validCoupons = Array.isArray(coupons) ? coupons : [];
    return validCoupons
      .filter((item) =>
        (item.couponTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.code || '').toUpperCase().includes(searchQuery.toUpperCase())
      )
      .map((item, index) => ({
        ...item,
        id: index + 1 || item._id,
      }));
  }, [coupons, searchQuery]);

  const memoizedEditData = useMemo(() => editData, [editData]);

  const columns = [
    { field: 'id', headerName: 'S.No', flex: 0.4, align: 'center', headerAlign: 'center' },
    { field: 'couponTitle', headerName: 'Coupon Title', flex: 1 },
    { field: 'code', headerName: 'Coupon Code', flex: 1 },
    {
      field: 'discount',
      headerName: 'Discount (%)',
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.value}%
        </Typography>
      )
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return isMobile ? (
          <>
            <IconButton onClick={(e) => handleMenuOpen(e, params.row)}>
              <MoreOutlined />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && currentRow?.id === params.row.id}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { handleView(params.row); handleMenuClose(); }}>
                View
              </MenuItem>
              <MenuItem onClick={() => { handleEdit(params.row); handleMenuClose(); }}>
                Edit
              </MenuItem>
              <MenuItem onClick={() => { handleDelete(params.row); handleMenuClose(); }}>
                Delete
              </MenuItem>
            </Menu>
          </>
        ) : (
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
          </>
        );
      },
    },
  ];

  return (
    <Box sx={pageStyles.mainBox}>
      <Typography variant="h4" sx={pageStyles.title}>{title}</Typography>
      <Typography component="p" sx={pageStyles.countList}>
        <span style={{ color: "#234155", fontWeight: 600 }}>{rows.length} {title}</span> are listed below
      </Typography>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search + New Button */}
      <Grid container spacing={2} sx={pageStyles.searchbox}>
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Title, Code"
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
                fontSize: '14px'
              },
              '& .MuiInputBase-input': {
                padding: '8px 12px'
              }
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

      {/* Loading Skeleton */}
      {loading && (
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={40} />
        </Box>
      )}

      {!loading && rows.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No coupons found.
        </Typography>
      )}

      {!loading && rows.length > 0 && (
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
      )}

      {/* Modals */}
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
    </Box>
  );
};

export default Index;