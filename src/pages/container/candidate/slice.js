import { createSlice } from '@reduxjs/toolkit';

const candidateSlice = createSlice({
  name: 'candidate',
  initialState: {
    candidates: [],
    selectedCandidate: {},
    candidateCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Create
    addCandidate: (state) => { state.loading = true; },
    addCandidateSuccess: (state, action) => {
      state.loading = false;
      state.candidates.push(action.payload);
    },
    addCandidateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get all
    getCandidate: (state) => { state.loading = true; },
    getCandidateSuccess: (state, action) => {
      state.loading = false;
      state.candidates = action.payload;
    },
    getCandidateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get by ID
    getCandidateById: (state) => { state.loading = true; },
    getCandidateByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedCandidate = action.payload;
    },
    getCandidateByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Total Count
    totalCount: (state) => { state.loading = true; },
    totalCountSuccess: (state, action) => {
      state.loading = false;
      state.candidateCount = action.payload.count;
    },
    totalCountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update
    updateCandidate: (state) => { state.loading = true; },
    updateCandidateSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.candidates = state.candidates.map((item) =>
        item._id === updated._id ? updated : item
      );
      if (state.selectedCandidate?._id === updated._id) {
        state.selectedCandidate = updated;
      }
    },
    updateCandidateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete
    deleteCandidate: (state) => { state.loading = true; },
    deleteCandidateSuccess: (state, action) => {
      const deletedId = action.payload;
      state.loading = false;
      state.candidates = state.candidates.filter((c) => c._id !== deletedId);
      if (state.selectedCandidate?._id === deletedId) {
        state.selectedCandidate = {};
      }
    },
    deleteCandidateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Block
    blockCandidate: (state) => { state.loading = true; },
    blockCandidateSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.candidates = state.candidates.map((item) =>
        item._id === updated._id ? updated : item
      );
      if (state.selectedCandidate?._id === updated._id) {
        state.selectedCandidate = updated;
      }
    },
    blockCandidateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reactivate
    reactivateCandidate: (state) => { state.loading = true; },
    reactivateCandidateSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.candidates = state.candidates.map((item) =>
        item._id === updated._id ? updated : item
      );
      if (state.selectedCandidate?._id === updated._id) {
        state.selectedCandidate = updated;
      }
    },
    reactivateCandidateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getCandidate,
  getCandidateSuccess,
  getCandidateFail,
  addCandidate,
  addCandidateSuccess,
  addCandidateFail,
  getCandidateById,
  getCandidateByIdSuccess,
  getCandidateByIdFail,
  totalCount,
  totalCountSuccess,
  totalCountFail,
  updateCandidate,
  updateCandidateSuccess,
  updateCandidateFail,
  deleteCandidate,
  deleteCandidateSuccess,
  deleteCandidateFail,
  blockCandidate,
  blockCandidateSuccess,
  blockCandidateFail,
  reactivateCandidate,
  reactivateCandidateSuccess,
  reactivateCandidateFail,
} = candidateSlice.actions;

export default candidateSlice.reducer;