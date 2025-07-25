import React from 'react';
import { Grid, FormLabel, TextField, FormControl, Select, MenuItem, Typography, FormHelperText } from '@mui/material';
import { Field, ErrorMessage } from 'formik';
import { fromStar } from '../../../../assets/style/commen';
import FileUpload from '../../../../utils/uplode/FileUpload';

const PersonalInformationStep = ({ formik, countries, countryLoading }) => {
    const { values, handleChange, setFieldValue } = formik;

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <Typography variant="h4" mb={1}>Personal Details</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>First Name <span style={fromStar.star}>*</span></FormLabel>
                    <Field
                        as={TextField}
                        name="firstName"
                        placeholder="Enter your first name"
                        fullWidth
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={<ErrorMessage name="firstName" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>Last Name <span style={fromStar.star}>*</span></FormLabel>
                    <Field
                        as={TextField}
                        name="lastName"
                        placeholder="Enter your last name"
                        fullWidth
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={<ErrorMessage name="lastName" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>Date of Birth <span style={fromStar.star}>*</span></FormLabel>
                    <Field
                        as={TextField}
                        type="date"
                        name="dateOfBirth"
                        placeholder="Select your date of birth"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={values.dateOfBirth}
                        onChange={handleChange}
                        error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                        helperText={<ErrorMessage name="dateOfBirth" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>Gender <span style={fromStar.star}>*</span></FormLabel>
                    <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}>
                        <Field
                            as={Select}
                            name="gender"
                            placeholder="Select your gender"
                            fullWidth
                            displayEmpty
                            value={values.gender}
                            onChange={handleChange}
                        >
                            <MenuItem value="" disabled>Select your gender</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Field>
                        <FormHelperText><ErrorMessage name="gender" /></FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>Email <span style={fromStar.star}>*</span></FormLabel>
                    <Field
                        as={TextField}
                        name="email"
                        placeholder="Enter your email"
                        fullWidth
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={<ErrorMessage name="email" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>Mobile <span style={fromStar.star}>*</span></FormLabel>
                    <Field
                        as={TextField}
                        name="mobile"
                        placeholder="Enter your mobile number"
                        fullWidth
                        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                        helperText={<ErrorMessage name="mobile" />}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography variant="h4" mb={1}>Address Details</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormLabel>Address Line 1 <span style={fromStar.star}>*</span></FormLabel>
                    <Field
                        as={TextField}
                        name="addressLine1"
                        placeholder="Enter your Address Line 1"
                        fullWidth
                        error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)}
                        helperText={<ErrorMessage name="addressLine1" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormLabel>Address Line 2</FormLabel>
                    <Field
                        as={TextField}
                        name="addressLine2"
                        placeholder="Enter your Address Line 2"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>Landmark</FormLabel>
                    <Field
                        as={TextField}
                        name="landmark"
                        placeholder="Enter your landmark"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>City <span style={fromStar.star}>*</span></FormLabel>
                    <Field
                        as={TextField}
                        name="city"
                        placeholder="Enter your city"
                        fullWidth
                        error={formik.touched.city && Boolean(formik.errors.city)}
                        helperText={<ErrorMessage name="city" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>District</FormLabel>
                    <Field
                        as={TextField}
                        name="district"
                        placeholder="Enter your district"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>State <span style={fromStar.star}>*</span></FormLabel>
                    <Field
                        as={TextField}
                        name="state"
                        placeholder="Enter your state"
                        fullWidth
                        error={formik.touched.state && Boolean(formik.errors.state)}
                        helperText={<ErrorMessage name="state" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth error={formik.touched.country && Boolean(formik.errors.country)}>
                        <FormLabel>Country <span style={fromStar.star}>*</span></FormLabel>
                        <Field
                            as={Select}
                            name="country"
                            value={values.country}
                            onChange={handleChange}
                            displayEmpty
                            disabled={countryLoading}
                        >
                            <MenuItem value="">Select Country</MenuItem>
                            {countries.map((country) => (
                                <MenuItem key={country._id} value={country._id}>
                                    {country.image && (
                                        <img
                                            src={country.image}
                                            alt={country.name}
                                            style={{ width: 24, height: 16, marginRight: 8, objectFit: 'cover', verticalAlign: 'middle' }}
                                        />
                                    )}
                                    {country.name} {country.code ? `(${country.code})` : ''}
                                </MenuItem>
                            ))}
                        </Field>
                        <FormHelperText><ErrorMessage name="country" /></FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormLabel>Zip Code <span style={fromStar.star}>*</span></FormLabel>
                    <Field
                        as={TextField}
                        name="zipCode"
                        placeholder="Enter your zip code"
                        fullWidth
                        error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                        helperText={<ErrorMessage name="zipCode" />}
                    />
                </Grid>
                <Grid item xs={12} sm={12} style={fromStar.upload}>
                    <FileUpload name="identityCard" label="Upload Identity Card" accept="image/*" />
                    <ErrorMessage name="identityCard" component="div" style={{ color: 'red' }} />
                </Grid>
            </Grid>
        </>
    );
};

export default PersonalInformationStep;