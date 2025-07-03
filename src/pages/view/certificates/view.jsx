import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer, Typography, Box, IconButton, Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { viewDrawerStyles } from '../../../assets/style/commen';

const View = ({ open, onClose, data }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '90%', sm: '50%', md: '40%' } },
      }}
    >
      <Box sx={viewDrawerStyles.mainBox}>
        <Box sx={viewDrawerStyles.head}>
          <IconButton onClick={onClose} sx={viewDrawerStyles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Grid sx={viewDrawerStyles.headContent}>
            <Typography sx={viewDrawerStyles.drawerTitle}>Certificate Details</Typography>
          </Grid>
        </Box>

        {data ? (
          <Grid container sx={viewDrawerStyles.dataContainer} mt={2}>
            <Grid item xs={12}>
              <Box mb={2} display="flex">
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Title</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.title || 'N/A'}</Typography>
                </Box>
              </Box>

              <Box mb={2} display="flex">
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Reference</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.reference || 'N/A'}</Typography>
                </Box>
              </Box>

              <Box mb={2} display="flex">
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Country</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.country?.name || 'N/A'}</Typography>
                </Box>
              </Box>

              <Box mb={2} display="flex">
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Description</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.description || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography sx={{ p: 2 }}>No certificate data available</Typography>
        )}
      </Box>
    </Drawer>
  );
};

View.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    title: PropTypes.string,
    reference: PropTypes.string,
    country: PropTypes.shape({
      name: PropTypes.string,
    }),
    description: PropTypes.string,
  }),
};

export default View;