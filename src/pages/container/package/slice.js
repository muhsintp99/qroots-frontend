import { createSlice } from '@reduxjs/toolkit';

const packageSlice = createSlice({
  name: 'packages',
  initialState: {
    packages: [],
    selectedPackage: {},
    loading: false,
    error: null,
  },
  reducers: {
    // Get all
    getPackages: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPackagesSuccess: (state, action) => {
      state.loading = false;
      state.packages = action.payload;
    },
    getPackagesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get by ID
    getPackageById: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPackageByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedPackage = action.payload;
    },
    getPackageByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Add
    addPackage: (state) => {
      state.loading = true;
      state.error = null;
    },
    addPackageSuccess: (state, action) => {
      state.loading = false;
      state.packages.push(action.payload);
    },
    addPackageFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update
    updatePackage: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePackageSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.packages = state.packages.map((p) =>
        p._id === updated._id ? updated : p
      );
      if (state.selectedPackage?._id === updated._id) {
        state.selectedPackage = updated;
      }
    },
    updatePackageFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete
    deletePackage: (state) => {
      state.loading = true;
      state.error = null;
    },
    deletePackageSuccess: (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      state.packages = state.packages.filter((p) => p._id !== deletedId);
      if (state.selectedPackage?._id === deletedId) {
        state.selectedPackage = {};
      }
    },
    deletePackageFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getPackages,
  getPackagesSuccess,
  getPackagesFail,
  getPackageById,
  getPackageByIdSuccess,
  getPackageByIdFail,
  addPackage,
  addPackageSuccess,
  addPackageFail,
  updatePackage,
  updatePackageSuccess,
  updatePackageFail,
  deletePackage,
  deletePackageSuccess,
  deletePackageFail,
} = packageSlice.actions;

export default packageSlice.reducer;
