import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

function createJobFormData(payload) {
  const formData = new FormData();
  Object.keys(payload).forEach(key => {
    if (key === '_id' || key === 'jobId') return;
    const value = payload[key];
    if (value !== null && value !== undefined) {
      if (key === 'skills' && Array.isArray(value)) {
        value.forEach((skill, index) => {
          formData.append(`skills[${index}]`, skill.trim().toLowerCase());
        });
      } else if (key === 'isActive') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value);
      }
    }
  });
  return formData;
}

function* getJobsSaga() {
  try {
    const params = {
      api: `${config.configApi}/jobs`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    yield put(actions.getJobsSuccess(response || { data: [], count: 0 }));
  } catch (error) {
    console.error('GET jobs Error:', error);
    yield put(actions.getJobsFail(error.message || 'Failed to load jobs'));
    toast.error(error.message || 'Failed to load jobs');
  }
}

function* getJobByIdSaga(action) {
  try {
    const params = { api: `${config.configApi}/jobs/${action.payload}`, method: 'GET' };
    const response = yield call(commonApi, params);
    yield put(actions.getJobByIdSuccess(response.data));
  } catch (error) {
    const err = error.message || 'Failed to fetch job';
    yield put(actions.getJobByIdFail(err));
    toast.error(err);
  }
}

function* addJobSaga(action) {
  try {
    const formData = createJobFormData(action.payload);
    const params = { api: `${config.configApi}/jobs`, method: 'POST', body: formData };
    const response = yield call(commonApi, params);
    yield put(actions.addJobSuccess({
      data: response.data,
      count: response.count || 0,
    }));
    toast.success('Job added successfully');
  } catch (error) {
    const err = error.message || 'Failed to add job';
    yield put(actions.addJobFail(err));
    toast.error(err);
  }
}

function* updateJobSaga(action) {
  try {
    const { _id, ...updateData } = action.payload;
    const formData = createJobFormData(updateData);
    const params = { api: `${config.configApi}/jobs/${_id}`, method: 'PUT', body: formData };
    const response = yield call(commonApi, params);
    yield put(actions.updateJobSuccess(response.data));
    toast.success('Job updated successfully');
  } catch (error) {
    const err = error.message || 'Failed to update job';
    yield put(actions.updateJobFail(err));
    toast.error(err);
  }
}

function* deleteJobSaga(action) {
  try {
    const params = { api: `${config.configApi}/jobs/${action.payload}`, method: 'DELETE' };
    yield call(commonApi, params);
    yield put(actions.deleteJobSuccess(action.payload));
    toast.success('Job deleted permanently');
    yield put(actions.getJobs());
  } catch (error) {
    const err = error.message || 'Failed to delete job';
    yield put(actions.deleteJobFail(err));
    toast.error(err);
  }
}

export default function* JobActionWatcher() {
  yield takeEvery('jobs/getJobs', getJobsSaga);
  yield takeEvery('jobs/addJob', addJobSaga);
  yield takeEvery('jobs/getJobById', getJobByIdSaga);
  yield takeEvery('jobs/updateJob', updateJobSaga);
  yield takeEvery('jobs/deleteJob', deleteJobSaga);
}