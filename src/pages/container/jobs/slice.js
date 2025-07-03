import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    selectedJob: null,
    jobCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null },
    clearSelectedJob: (state) => { state.selectedJob = null },

    addJob: (state) => { state.loading = true; state.error = null },
    addJobSuccess: (state, action) => {
      state.loading = false;
      state.jobs.push(action.payload.data);
      state.jobCount = action.payload.count;
    },
    addJobFail: (state, action) => { state.loading = false; state.error = action.payload },

    getJobs: (state) => { state.loading = true; state.error = null },
    getJobsSuccess: (state, action) => {
      state.loading = false;
      state.jobs = action.payload.data;
    },
    getJobsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getJobById: (state) => { state.loading = true; state.error = null },
    getJobByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedJob = action.payload;
    },
    getJobByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.selectedJob = null;
    },

    updateJob: (state) => { state.loading = true; state.error = null },
    updateJobSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.jobs = state.jobs.map((item) =>
        item._id === updated._id ? updated : item
      );
      if (state.selectedJob?._id === updated._id) {
        state.selectedJob = updated;
      }
    },
    updateJobFail: (state, action) => { state.loading = false; state.error = action.payload },

    deleteJob: (state) => { state.loading = true; state.error = null },
    deleteJobSuccess: (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      state.jobs = state.jobs.filter(job => job._id !== deletedId);
      state.jobCount = Math.max(0, state.jobCount - 1);
      if (state.selectedJob?._id === deletedId) {
        state.selectedJob = null;
      }
    },
    deleteJobFail: (state, action) => { state.loading = false; state.error = action.payload },
  }
});

export const {
  clearError, clearSelectedJob,
  addJob, addJobSuccess, addJobFail,
  getJobs, getJobsSuccess, getJobsFail,
  getJobById, getJobByIdSuccess, getJobByIdFail,
  updateJob, updateJobSuccess, updateJobFail,
  deleteJob, deleteJobSuccess, deleteJobFail
} = jobSlice.actions;

export default jobSlice.reducer;