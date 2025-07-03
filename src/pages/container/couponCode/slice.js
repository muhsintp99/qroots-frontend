import { createSlice } from '@reduxjs/toolkit';

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    coupons: [],
    selectedCoupon: null,
    couponCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Create
    addCoupon: (state) => {
      state.loading = true;
      state.error = null;
    },
    addCouponSuccess: (state, action) => {
      state.loading = false;
      state.coupons.push(action.payload);
    },
    addCouponFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.error('Add Coupon Failed:', action.payload); // Debug log
    },

    // Get all
    getCoupons: (state) => { // No payload expected
      state.loading = true;
      state.error = null;
    },
    getCouponsSuccess: (state, action) => {
      state.loading = false;
      state.coupons = Array.isArray(action.payload) ? action.payload : []; // Handle undefined or non-array
      if (!Array.isArray(action.payload)) {
        console.warn('getCouponsSuccess received non-array payload:', action.payload); // Debug log
      }
    },
    getCouponsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.error('Get Coupons Failed:', action.payload); // Debug log
    },

    // Get by ID
    getCouponById: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCouponByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedCoupon = action.payload;
    },
    getCouponByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.error('Get Coupon By ID Failed:', action.payload); // Debug log
    },

    // Total Count
    totalCount: (state) => {
      state.loading = true;
      state.error = null;
    },
    totalCountSuccess: (state, action) => {
      state.loading = false;
      state.couponCount = action.payload.count;
    },
    totalCountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.error('Total Count Failed:', action.payload); // Debug log
    },

    // Update
    updateCoupon: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCouponSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.coupons = state.coupons.map((item) =>
        item._id === updated._id ? updated : item
      );
      if (state.selectedCoupon?._id === updated._id) {
        state.selectedCoupon = updated;
      }
    },
    updateCouponFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.error('Update Coupon Failed:', action.payload); // Debug log
    },

    // Delete
    deleteCoupon: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCouponSuccess: (state, action) => {
      const deletedId = action.payload;
      state.loading = false;
      state.coupons = state.coupons.filter((c) => c._id !== deletedId);
      if (state.selectedCoupon?._id === deletedId) {
        state.selectedCoupon = null;
      }
    },
    deleteCouponFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.error('Delete Coupon Failed:', action.payload); // Debug log
    },
  },
});

export const {
  getCoupons,
  getCouponsSuccess,
  getCouponsFail,
  addCoupon,
  addCouponSuccess,
  addCouponFail,
  getCouponById,
  getCouponByIdSuccess,
  getCouponByIdFail,
  totalCount,
  totalCountSuccess,
  totalCountFail,
  updateCoupon,
  updateCouponSuccess,
  updateCouponFail,
  deleteCoupon,
  deleteCouponSuccess,
  deleteCouponFail,
} = couponSlice.actions;

export default couponSlice.reducer;