import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCertificate,
  deleteCertificate,
  getCertificates,
  updateCertificate,
} from '../../container/certificate/slice';
import { getCountry } from '../../container/country/slice';
import {
  DeleteOutlined,
  EyeOutlined,
  FormOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Typography,
  Box,
  TextField,
  useMediaQuery,
  InputAdornment,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../assets/style/commen';
import { StyledDataGrid } from '../../../assets/style/index';
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
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const dispatch = useDispatch();
  const { certificates, loading, error } = useSelector((state) => state.certificates || { certificates: [], loading: false, error: null });
  const { countries, loading: countryLoading } = useSelector((state) => state.country || { countries: [], loading: false });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = 'Certificates';

  useEffect(() => {
    console.log('Dispatching getCertificates and getCountry');
    dispatch(getCertificates());
    if (!countries.length && !countryLoading) {
      dispatch(getCountry());
    }
  }, [dispatch, countries.length, countryLoading]);

  useEffect(() => {
    if (!loading && submissionStatus === 'pending') {
      if (!error) {
        setOpenDialog(false);
        setEditData(null);
        setSubmissionStatus(null);
      } else {
        setSubmissionStatus('failed');
      }
    }
  }, [loading, error, submissionStatus]);

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
      dispatch(deleteCertificate(data._id));
      setOpenDeleteDialog(false);
      setDeleteData(null);
    }
  };

  const handleSubmitForm = (values, { setSubmitting, resetForm }) => {
    setSubmissionStatus('pending');
    if (editData && editData._id) {
      dispatch(updateCertificate({ _id: editData._id, ...values }));
    } else {
      dispatch(createCertificate(values));
    }
    setSubmitting(false);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const rows = useMemo(() => {
    if (!Array.isArray(certificates)) {
      console.warn('Certificates is not an array:', certificates);
      return [];
    }
    return certificates
      .filter((item) =>
        [item.title, item.reference, item.country?.name]
          .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .map((item, index) => ({
        ...item,
        id: index + 1,
      }));
  }, [certificates, searchQuery]);

  const columns = [
    { field: 'id', headerName: 'S.No', flex: 0.4 },
    { field: 'title', headerName: 'Certificate Name', flex: 1 },
    { field: 'reference', headerName: 'Reference', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { 
      field: 'issueDate', 
      headerName: 'Issue Date', 
      flex: 0.5, 
      renderCell: (params) => formatDate(params.value) 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.6,
      sortable: false,
      renderCell: (params) => (
        <>
          <EyeOutlined style={pageStyles.viewIcon} onClick={() => handleView(params.row)} />
          <FormOutlined style={pageStyles.editIcon} onClick={() => handleEdit(params.row)} />
          <DeleteOutlined style={pageStyles.deleteIcon} onClick={() => handleDelete(params.row)} />
        </>
      ),
    },
  ];

  return (
    <Box sx={pageStyles.mainBox}>
      <Typography variant="h4" sx={pageStyles.title}>{title}</Typography>
      <Typography component="p" sx={pageStyles.countList}>
        <span style={{ color: '#234155', fontWeight: 600 }}>{rows.length} {title}</span> are listed below
      </Typography>

      <Grid container spacing={2} sx={pageStyles.searchbox}>
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title, reference, or country"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlined style={pageStyles.newButtonIcon} />
                </InputAdornment>
              ),
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading certificates...</Typography>
        </Box>
      )}
      {!loading && error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {typeof error === 'string' ? error : 'An unexpected error occurred. Please try again.'}
        </Typography>
      )}
      {!loading && !error && rows.length === 0 && (
        <Typography sx={{ mt: 2 }}>No certificates found.</Typography>
      )}
      {submissionStatus === 'failed' && (
        <Typography color="error" sx={{ mt: 2 }}>
          Submission failed: {typeof error === 'string' ? error : 'An unexpected error occurred.'}
        </Typography>
      )}

      <StyledDataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
        autoHeight
      />

      <AddEdit
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSubmissionStatus(null);
        }}
        onSubmit={handleSubmitForm}
        editData={editData}
      />

      <View
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={selectedRow}
      />

      <DeleteModel
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        data={deleteData}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default Index;