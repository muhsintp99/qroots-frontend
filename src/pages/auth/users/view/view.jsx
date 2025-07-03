import { Drawer, Typography, Box, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const capitalize = (str) => str?.toLowerCase()?.replace(/\b\w/g, (c) => c.toUpperCase()) || 'N/A';

const View = ({ open, onClose, data }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '90%', sm: '50%', md: '40%' },
          bgcolor: '#fff',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>User Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {data ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>First Name</Typography>
                  <Typography variant="body2">{capitalize(data.fname)}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Last Name</Typography>
                  <Typography variant="body2">{capitalize(data.lname)}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Email</Typography>
                  <Typography variant="body2">{data.email || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Mobile</Typography>
                  <Typography variant="body2">{data.mobile || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>User Type</Typography>
                  <Typography variant="body2">{capitalize(data.userType)}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Status</Typography>
                  <Typography variant="body2">{capitalize(data.status)}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Profile Image</Typography>
                  {data.image ? (
                    <img src={data.image} alt="User" style={{ width: 50, height: 50, borderRadius: '50%' }} />
                  ) : (
                    <Typography variant="body2">No image</Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography sx={{ p: 2 }}>No data available</Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default View;