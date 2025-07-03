import React from 'react';
import {
  Drawer,
  Typography,
  Box,
  IconButton,
  Grid,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { viewDrawerStyles } from '../../../assets/style/commen';

// Reintegrated capitalize function
const capitalize = (str) => str?.toLowerCase()?.replace(/\b\w/g, c => c.toUpperCase()) || '';

const View = ({ open, onClose, data, loading = false }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { sm: '300px', md: '400px' }, // Consistent width
        },
      }}
    >
      <Box sx={viewDrawerStyles.mainBox}>
        <Box sx={viewDrawerStyles.head}>
          <IconButton onClick={onClose} sx={viewDrawerStyles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Grid sx={viewDrawerStyles.headContent}>
            <Typography sx={viewDrawerStyles.drawerTitle}>Coupon Details</Typography>
          </Grid>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : data ? (
          <Grid container sx={viewDrawerStyles.dataContainer} mt={2}>
            <Grid item xs={12} md={6}>
              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Coupon Title</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data?.couponTitle ? capitalize(data.couponTitle) : 'N/A'}</Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Coupon Code</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data?.code || 'N/A'}</Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Discount</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data?.discount ? `${data.discount}%` : 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>End Date</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {data?.endDate ? new Date(data.endDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Status</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {data?.status ? capitalize(data.status) : 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Created At</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Updated At</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography sx={{ mt: 2 }}>No data available</Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default View;