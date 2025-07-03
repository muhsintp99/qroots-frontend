import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

// GET All Jobs
function* getJobsSaga() {
  try {
    const params = {
      api: `${config.configApi}/jobs`,
      method: 'GET',
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    const jobs = response.jobs || response.data || response || [];
    yield put(actions.getJobsSuccess(jobs));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to load jobs';
    console.error('GET Jobs Error:', error);
    yield put(actions.getJobsFail(errorMessage));
    toast.error(errorMessage);
  }
}

// GET Job By jobId
function* getJobByIdSaga(action) {
  try {
    const encodedJobId = encodeURIComponent(action.payload); // Encode jobId to handle slashes
    const params = {
      api: `${config.configApi}/jobs/${encodedJobId}`,
      method: 'GET',
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    const job = response.job || response.data || response;
    yield put(actions.getJobByIdSuccess(job));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to get job';
    console.error('GET Job By ID Error:', error);
    yield put(actions.getJobByIdFail(errorMessage));
    toast.error(errorMessage);
  }
}

// ADD Job
function* addJobSaga(action) {
  try {
    console.log('Add Job Payload:', action.payload);
    const {
      title,
      description,
      company,
      location,
      country,
      certificate,
      salary,
      jobType,
      experience,
      skills,
      isActive,
    } = action.payload;
    const payload = {
      title,
      description,
      company,
      location,
      country,
      certificate,
      salary: salary || null,
      jobType: jobType || 'Full-Time',
      experience: experience || null,
      skills: skills || [],
      isActive: isActive !== undefined ? isActive : true,
    };

    const params = {
      api: `${config.configApi}/jobs`,
      method: 'POST',
      authorization: 'Bearer',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    };
    const response = yield call(commonApi, params);
    yield put(actions.addJobSuccess(response.job || response.data));
    yield put(actions.getJobs());
    toast.success('Job added successfully');
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to add job';
    console.error('Add Job Error:', error);
    yield put(actions.addJobFail(errorMessage));
    toast.error(errorMessage);
  }
}

// UPDATE Job
function* updateJobSaga(action) {
  try {
    console.log('Update Job Payload:', action.payload);
    const {
      jobId,
      title,
      description,
      company,
      location,
      country,
      certificate,
      salary,
      jobType,
      experience,
      skills,
      isActive,
    } = action.payload;
    const payload = {
      title,
      description,
      company,
      location,
      country,
      certificate,
      salary,
      jobType,
      experience,
      skills,
      isActive,
    };

    const encodedJobId = encodeURIComponent(jobId); // Encode jobId to handle slashes
    const params = {
      api: `${config.configApi}/jobs/${encodedJobId}`,
      method: 'PUT',
      authorization: 'Bearer',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    };
    const response = yield call(commonApi, params);
    yield put(actions.updateJobSuccess(response.job || response.data));
    yield put(actions.getJobs());
    toast.success('Job updated successfully');
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Update failed';
    console.error('Update Job Error:', error);
    yield put(actions.updateJobFail(errorMessage));
    toast.error(errorMessage);
  }
}

// DELETE Job (soft)
function* deleteJobSaga(action) {
  try {
    const encodedJobId = encodeURIComponent(action.payload); // Encode jobId to handle slashes
    const params = {
      api: `${config.configApi}/jobs/${encodedJobId}`,
      method: 'DELETE',
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    yield put(actions.deleteJobSuccess(response.job || response.data));
    yield put(actions.getJobs());
    toast.success('Job deleted successfully');
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
    console.error('Delete Job Error:', error);
    yield put(actions.deleteJobFail(errorMessage));
    toast.error(errorMessage);
  }
}

// GET Job Count
function* totalCountSaga() {
  try {
    const params = {
      api: `${config.configApi}/jobs/count`,
      method: 'GET',
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    const count = response.count || response.data?.count || 0;
    yield put(actions.totalCountSuccess({ count }));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to get job count';
    console.error('Get Job Count Error:', error);
    yield put(actions.totalCountFail(errorMessage));
    toast.error(errorMessage);
  }
}

export default function* JobActionWatcher() {
  yield takeEvery('jobs/getJobs', getJobsSaga);
  yield takeEvery('jobs/totalCount', totalCountSaga);
  yield takeEvery('jobs/addJob', addJobSaga);
  yield takeEvery('jobs/getJobById', getJobByIdSaga);
  yield takeEvery('jobs/updateJob', updateJobSaga);
  yield takeEvery('jobs/deleteJob', deleteJobSaga);
}