import React from 'react';
import { Drawer, Typography, Box, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { viewDrawerStyles } from '../../../../assets/style/commen';

const capitalize = (str) => str?.toLowerCase()?.replace(/\b\w/g, (c) => c.toUpperCase()) || '';

const View = ({ open, onClose, data }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            sm: data && Object.keys(data).length > 6 ? '90%' : '50%',
            md: data && Object.keys(data).length > 6 ? '50%' : '30%',
          },
        },
      }}
    >
      <Box sx={viewDrawerStyles.mainBox}>
        <Box sx={viewDrawerStyles.head}>
          <IconButton onClick={onClose} sx={viewDrawerStyles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Grid sx={viewDrawerStyles.headContent}>
            <Typography sx={viewDrawerStyles.drawerTitle}>User Details</Typography>
          </Grid>
        </Box>

        {data ? (
          <Grid container sx={viewDrawerStyles.dataContainer} mt={2}>
            <Grid item xs={12} md={6}>
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>Profile Image</strong>
                  </Typography>
                  <img
                    src={data.image}
                    alt="User"
                    style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px', marginTop: '4px' }}
                  />
                </Box>
              </Box>
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>First Name</strong>
                  </Typography>
                  <Typography sx={viewDrawerStyles.value}>{capitalize(data.fname)}</Typography>
                </Box>
              </Box>
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>Last Name</strong>
                  </Typography>
                  <Typography sx={viewDrawerStyles.value}>{capitalize(data.lname)}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>Email</strong>
                  </Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.email}</Typography>
                </Box>
              </Box>
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>Mobile</strong>
                  </Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.mobile}</Typography>
                </Box>
              </Box>
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>User Type</strong>
                  </Typography>
                  <Typography sx={viewDrawerStyles.value}>{capitalize(data.userType)}</Typography>
                </Box>
              </Box>
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>Status</strong>
                  </Typography>
                  <Typography sx={viewDrawerStyles.value}>{capitalize(data.status)}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography>No data available</Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default View;