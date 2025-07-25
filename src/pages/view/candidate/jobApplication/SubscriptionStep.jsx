import React from 'react';
import {
  Grid,
  FormLabel,
  Typography,
  CircularProgress,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { Field, ErrorMessage } from 'formik';
import { fromStar } from '../../../../assets/style/commen';

const SubscriptionStep = ({ formik, packages, packageLoading, coupons, couponLoading }) => {
  const { values, setFieldValue } = formik;

  return (
    <>
      <Grid container spacing={3}>
        {/* Title */}
        <Grid item xs={12}>
          <Typography variant="h4" mb={1}>Subscription</Typography>
        </Grid>

        {/* Package Selection */}
        <Grid item xs={12}>
          <FormLabel>Subscription Package <span style={fromStar.star}>*</span></FormLabel>
          <Grid container spacing={2} mt={1}>
            {packageLoading ? (
              <Grid item xs={12}>
                <CircularProgress size={20} />
              </Grid>
            ) : packages.length > 0 ? (
              packages.map((pkg) => (
                <Grid item xs={12} sm={6} md={4} key={pkg._id}>
                  <Card
                    sx={{
                      border: values.package === pkg._id ? '2px solid #1976d2' : 'none',
                      backgroundColor: values.package === pkg._id ? '#e3f2fd' : 'white',
                    }}
                  >
                    <CardActionArea
                      onClick={() => setFieldValue('package', pkg._id)}
                      disabled={packageLoading}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
                          {pkg.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {pkg.description}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          <strong>Package ID:</strong> {pkg.packId}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          <strong>Type:</strong> {pkg.type}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          <strong>Rate:</strong> ₹{pkg.rate}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          <strong>Status:</strong> {pkg.status}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          <strong>Active:</strong> {pkg.isActive ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          <strong>Created At:</strong> {new Date(pkg.createdAt).toLocaleDateString()}
                        </Typography>

                        {pkg.points && pkg.points.length > 0 && (
                          <Box mt={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                              <strong>Points:</strong>
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                              {pkg.points.map((point, idx) => (
                                <Chip key={idx} label={point} color="secondary" size="small" />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography>No packages available</Typography>
              </Grid>
            )}
          </Grid>
          <ErrorMessage
            name="package"
            component="div"
            style={{ color: 'red', marginTop: '8px' }}
          />
        </Grid>

        {/* Coupon Code Dropdown with correct Field usage */}
        <Grid item xs={12} sm={6}>
          <FormLabel>Coupon Code</FormLabel>
          <Field name="couponCode">
            {({ field, meta }) => (
              <TextField
                {...field}
                select
                fullWidth
                disabled={couponLoading}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {couponLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <MenuItem key={coupon._id} value={coupon._id}>
                      {coupon.code || coupon.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No coupons available</MenuItem>
                )}
              </TextField>
            )}
          </Field>
        </Grid>
      </Grid>
    </>
  );
};

export default SubscriptionStep;
