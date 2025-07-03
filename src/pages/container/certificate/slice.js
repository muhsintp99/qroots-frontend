import { createSlice } from '@reduxjs/toolkit';

const certificateSlice = createSlice({
  name: 'certificates',
  initialState: {
    certificates: [],
    selectedCertificate: null,
    loading: false,
    error: null,
    count: 0,
  },
  reducers: {
    clearCertificateError: (state) => { state.error = null; },
    clearSelectedCertificate: (state) => { state.selectedCertificate = null; },

    getCertificates: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCertificatesSuccess: (state, action) => {
      console.log('getCertificatesSuccess payload:', action.payload);
      state.loading = false;
      state.certificates = action.payload.data || [];
      state.count = action.payload.count || 0;
      console.log('Updated certificates state:', state.certificates);
    },
    getCertificatesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.error('Get certificates failed:', action.payload);
    },

    getCertificateById: (state) => { state.loading = true; },
    getCertificateByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedCertificate = action.payload;
    },
    getCertificateByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createCertificate: (state) => { state.loading = true; },
    createCertificateSuccess: (state, action) => {
      state.loading = false;
      state.certificates.unshift(action.payload);
      state.count += 1;
    },
    createCertificateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateCertificate: (state) => { state.loading = true; },
    updateCertificateSuccess: (state, action) => {
      state.loading = false;
      state.certificates = state.certificates.map((c) =>
        c._id === action.payload._id ? action.payload : c
      );
      if (state.selectedCertificate?._id === action.payload._id) {
        state.selectedCertificate = action.payload;
      }
    },
    updateCertificateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteCertificate: (state) => { state.loading = true; },
    deleteCertificateSuccess: (state, action) => {
      state.loading = false;
      state.certificates = state.certificates.filter((c) => c._id !== action.payload);
      state.count -= 1;
      if (state.selectedCertificate?._id === action.payload) {
        state.selectedCertificate = null;
      }
    },
    deleteCertificateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  clearCertificateError,
  clearSelectedCertificate,
  getCertificates,
  getCertificatesSuccess,
  getCertificatesFail,
  getCertificateById,
  getCertificateByIdSuccess,
  getCertificateByIdFail,
  createCertificate,
  createCertificateSuccess,
  createCertificateFail,
  updateCertificate,
  updateCertificateSuccess,
  updateCertificateFail,
  deleteCertificate,
  deleteCertificateSuccess,
  deleteCertificateFail,
} = certificateSlice.actions;

export default certificateSlice.reducer;