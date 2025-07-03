import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    selectedJob: {},
    jobCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Create job
    addJob: (state) => {
      state.loading = true;
      state.error = null;
    },
    addJobSuccess: (state, action) => {
      state.loading = false;
      state.jobs.push(action.payload);
      state.error = null;
    },
    addJobFail: (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to add job';
    },

    // Get all jobs
    getJobs: (state) => {
      state.loading = true;
      state.error = null;
    },
    getJobsSuccess: (state, action) => {
      state.loading = false;
      state.jobs = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    getJobsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch jobs';
    },

    // Get job by jobId
    getJobById: (state) => {
      state.loading = true;
      state.error = null;
    },
    getJobByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedJob = action.payload || {};
      state.error = null;
    },
    getJobByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch job';
    },

    // Get total count
    totalCount: (state) => {
      state.loading = true;
      state.error = null;
    },
    totalCountSuccess: (state, action) => {
      state.loading = false;
      state.jobCount = action.payload?.count ?? 0;
      state.error = null;
    },
    totalCountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch job count';
    },

    // Update job
    updateJob: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateJobSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      if (updated?.jobId) {
        state.jobs = state.jobs.map((item) =>
          item.jobId === updated.jobId ? updated : item
        );
        if (state.selectedJob?.jobId === updated.jobId) {
          state.selectedJob = updated;
        }
      }
      state.error = null;
    },
    updateJobFail: (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update job';
    },

    // Delete job (soft)
    deleteJob: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteJobSuccess: (state, action) => {
      const updated = action.payload;
      state.loading = false;
      if (updated?.jobId) {
        state.jobs = state.jobs.map((item) =>
          item.jobId === updated.jobId ? updated : item
        );
        if (state.selectedJob?.jobId === updated.jobId) {
          state.selectedJob = updated;
        }
      }
      state.error = null;
    },
    deleteJobFail: (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to delete job';
    },

    // Reset error
    resetError: (state) => {
      state.error = null;
    },

    // Reset state
    resetState: (state) => {
      state.jobs = [];
      state.selectedJob = {};
      state.jobCount = 0;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  addJob,
  addJobSuccess,
  addJobFail,
  getJobs,
  getJobsSuccess,
  getJobsFail,
  getJobById,
  getJobByIdSuccess,
  getJobByIdFail,
  totalCount,
  totalCountSuccess,
  totalCountFail,
  updateJob,
  updateJobSuccess,
  updateJobFail,
  deleteJob,
  deleteJobSuccess,
  deleteJobFail,
  resetError,
  resetState,
} = jobSlice.actions;

export default jobSlice.reducer;