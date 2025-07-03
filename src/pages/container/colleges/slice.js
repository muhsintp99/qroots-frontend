import { createSlice } from '@reduxjs/toolkit';

const collegeSlice = createSlice({
  name: 'colleges',
  initialState: {
    colleges: [],
    selectedCollege: null,
    collegeCount: 0,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Clear error action
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear selected college
    clearSelectedCollege: (state) => {
      state.selectedCollege = null;
    },

    // ADD COLLEGE
    addCollege: (state) => {
      state.loading = true;
      state.error = null;
    },
    addCollegeSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.colleges.unshift(action.payload); // Add to beginning
      }
    },
    addCollegeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // GET COLLEGES
    getColleges: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCollegesSuccess: (state, action) => {
      state.loading = false;
      const { colleges, pagination } = action.payload;
      state.colleges = colleges || [];
      state.pagination = pagination || null;
      console.log('getCollegesSuccess:', colleges);
    },
    getCollegesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.colleges = [];
      console.log('getCollegesFail:', action.payload);
    },

    // GET COLLEGE BY ID
    getCollegeById: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCollegeByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedCollege = action.payload;
    },
    getCollegeByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.selectedCollege = null;
    },

    // TOTAL COUNT
    totalCount: (state) => {
      state.loading = true;
      state.error = null;
    },
    totalCountSuccess: (state, action) => {
      state.loading = false;
      state.collegeCount = action.payload.count || 0;
    },
    totalCountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // UPDATE COLLEGE
    updateCollege: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCollegeSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      if (updated && updated._id) {
        // Update in colleges array
        const index = state.colleges.findIndex(item => item._id === updated._id);
        if (index !== -1) {
          state.colleges[index] = updated;
        }
        // Update selected college if it's the same
        if (state.selectedCollege?._id === updated._id) {
          state.selectedCollege = updated;
        }
      }
    },
    updateCollegeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // SOFT DELETE COLLEGE
    softDeleteCollege: (state) => {
      state.loading = true;
      state.error = null;
    },
    softDeleteCollegeSuccess: (state, action) => {
      state.loading = false;
      const deleted = action.payload;
      if (deleted && deleted.data && deleted.data._id) {
        // Remove from colleges array since it's soft deleted
        state.colleges = state.colleges.filter(item => item._id !== deleted.data._id);
        // Clear selected college if it's the same
        if (state.selectedCollege?._id === deleted.data._id) {
          state.selectedCollege = null;
        }
      }
    },
    softDeleteCollegeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // HARD DELETE COLLEGE
    deleteCollege: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCollegeSuccess: (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      if (deletedId) {
        state.colleges = state.colleges.filter(c => c._id !== deletedId);
        if (state.selectedCollege?._id === deletedId) {
          state.selectedCollege = null;
        }
        state.collegeCount = Math.max(0, state.collegeCount - 1);
      }
    },
    deleteCollegeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

  },
});

export const {
  clearError,
  clearSelectedCollege,

  addCollege,
  addCollegeSuccess,
  addCollegeFail,

  getColleges,
  getCollegesSuccess,
  getCollegesFail,

  getCollegeById,
  getCollegeByIdSuccess,
  getCollegeByIdFail,

  totalCount,
  totalCountSuccess,
  totalCountFail,

  updateCollege,
  updateCollegeSuccess,
  updateCollegeFail,

  softDeleteCollege,
  softDeleteCollegeSuccess,
  softDeleteCollegeFail,

  deleteCollege,
  deleteCollegeSuccess,
  deleteCollegeFail,
  
} = collegeSlice.actions;

export default collegeSlice.reducer;