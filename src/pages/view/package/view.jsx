import React from 'react';
import {
  Drawer,
  Typography,
  Box,
  IconButton,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { viewDrawerStyles } from '../../../assets/style/commen';

const capitalize = (str) => str?.toLowerCase()?.replace(/\b\w/g, c => c.toUpperCase()) || '';

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
          }
        },
      }}
    >
      <Box sx={viewDrawerStyles.mainBox}>
        <Box sx={viewDrawerStyles.head}>
          <IconButton onClick={onClose} sx={viewDrawerStyles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Grid sx={viewDrawerStyles.headContent}>
            <Typography sx={viewDrawerStyles.drawerTitle}>Package Details</Typography>
          </Grid>
        </Box>

        {data ? (
          <Grid container sx={viewDrawerStyles.dataContainer} mt={2}>
            <Grid item xs={12} md={6}>
              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Package ID</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.packId}</Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Title</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{capitalize(data.title)}</Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Rate</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>${data.rate.toFixed(2)}</Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Type</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{capitalize(data.type)}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Status</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{capitalize(data.status)}</Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Active</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.isActive ? 'Yes' : 'No'}</Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Created At</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Updated At</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box mb={2} style={{ display: "flex" }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Description</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.description || 'N/A'}</Typography>
                </Box>
              </Box>

              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Points</strong></Typography>
                  {Array.isArray(data.points) && data.points.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {data.points.map((point, idx) => (
                        <li key={idx} style={{ fontSize: '14px', color: '#333', marginBottom: '4px' }}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography sx={viewDrawerStyles.value}>None</Typography>
                  )}
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