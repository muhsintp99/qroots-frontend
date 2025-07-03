import React from 'react';
import {
  Drawer,
  Typography,
  Box,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { viewDrawerStyles } from '../../../assets/style/commen.js';

const View = ({ open, onClose, data }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '90%', sm: '50%', md: '40%' },
        },
      }}
      aria-labelledby="job-details-title"
    >
      <Box sx={viewDrawerStyles.mainBox} role="dialog" aria-label="Job Details Drawer">
        <Box sx={viewDrawerStyles.head}>
          <IconButton onClick={onClose} sx={viewDrawerStyles.closeButton} aria-label="Close job details">
            <CloseIcon />
          </IconButton>
          <Grid sx={viewDrawerStyles.global}>
            <Typography id="job-details-title" sx={viewDrawerStyles.drawerTitle}>Job Details</Typography>
          </Grid>
        </Box>

        {data ? (
          <Grid container sx={viewDrawerStyles.dataContainer} mt={2}>
            <Grid item xs={12} md={6}>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Job ID</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.jobId || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Title</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.title || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Company</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.company || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Location</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.location || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Country</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.country?.name || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Certificate</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.certificate?.title || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Job Type</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.jobType || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Salary</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.salary ? `$${data.salary.toLocaleString()}` : 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Experience</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.experience || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Posted By</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.postedBy?.username || data.postedBy?.email || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Status</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.isActive ? 'Active' : 'Inactive'}</Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Skills</strong></Typography>
                  {data.skills?.length > 0 ? (
                    <List dense aria-label="Skills list">
                      {data.skills.map((skill, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`# ${skill || 'N/A'}`} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography sx={viewDrawerStyles.value}>No skills listed</Typography>
                  )}
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="flex-start">
                <ArrowRightIcon fontSize="small" aria-hidden="true" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Description</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.description || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography sx={{ p: 2 }} aria-live="polite">No data available</Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default View;