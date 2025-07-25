import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

// GET All Candidates
function* getCandidateSaga() {
  try {
    const params = {
      api: `${config.configApi}/candidates`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    console.log('GET Candidate Response:', response);
    const candidates = response.candidates || response.data || response || [];
    yield put(actions.getCandidateSuccess(candidates));
  } catch (error) {
    console.error('GET Candidate Error:', error);
    yield put(actions.getCandidateFail(error.message));
    toast.error(error.message || 'Failed to load candidates');
  }
}

// GET Candidate By ID
function* getCandidateByIdSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/candidates/${action.payload}`,
      method: 'GET',
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    const candidate = response.data || response;
    yield put(actions.getCandidateByIdSuccess(candidate));
  } catch (error) {
    console.error('GET Candidate By ID Error:', error);
    yield put(actions.getCandidateByIdFail(error.message));
    toast.error(error.message || 'Failed to get candidate');
  }
}

// ADD Candidate
function* addCandidateSaga(action) {
  try {
    const formData = action.payload instanceof FormData ? action.payload : new FormData();
    if (!(action.payload instanceof FormData)) {
      Object.keys(action.payload).forEach((key) => {
        formData.append(key, action.payload[key]);
      });
    }

    const params = {
      api: `${config.configApi}/candidates/register`,
      method: 'POST',
      authorization: false,
      body: formData,
    };

    const response = yield call(commonApi, params);
    yield put(actions.addCandidateSuccess(response.data.candidate));
    yield put(actions.getCandidate());
    toast.success('Candidate added successfully');
  } catch (error) {
    console.error('Add Candidate Error:', error);
    yield put(actions.addCandidateFail(error.message || 'Error while adding candidate'));
    toast.error(error.message || 'Failed to add candidate');
  }
}

// UPDATE Candidate
function* updateCandidateSaga(action) {
  try {
    console.log('Update Candidate Payload:', action.payload);
    const { id, data } = action.payload;
    const { email, mobile, firstName, lastName, dob, addressLine1, addressLine2, city, district, state, zipCode, country, image } = data;
    const formData = new FormData();
    if (email) formData.append('email', email);
    if (mobile) formData.append('mobile', mobile);
    if (firstName) formData.append('firstName', firstName);
    if (lastName) formData.append('lastName', lastName);
    if (dob) formData.append('dob', dob);
    if (addressLine1) formData.append('addressLine1', addressLine1);
    if (addressLine2) formData.append('addressLine2', addressLine2);
    if (city) formData.append('city', city);
    if (district) formData.append('district', district);
    if (state) formData.append('state', state);
    if (zipCode) formData.append('zipCode', zipCode);
    if (country) formData.append('country', country);
    if (image) formData.append('image', image);

    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const params = {
      api: `${config.configApi}/candidates/update`,
      method: 'PUT',
      body: formData,
      authorization: 'Bearer',
    };

    const response = yield call(commonApi, params);
    yield put(actions.updateCandidateSuccess(response.data.candidate));
    yield put(actions.getCandidate());
    toast.success('Candidate updated successfully');
  } catch (error) {
    console.error('Update Candidate Error:', error);
    yield put(actions.updateCandidateFail(error.message));
    toast.error(error.message || 'Update failed');
  }
}

// DELETE Candidate
function* deleteCandidateSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/candidates/${action.payload}`,
      method: 'DELETE',
      authorization: 'Bearer',
    };
    yield call(commonApi, params);
    yield put(actions.deleteCandidateSuccess(action.payload));
    yield put(actions.getCandidate());
    toast.success('Candidate deleted successfully');
  } catch (error) {
    console.error('Delete Candidate Error:', error);
    yield put(actions.deleteCandidateFail(error.message));
    toast.error(error.message || 'Failed to delete candidate');
  }
}

// BLOCK Candidate
function* blockCandidateSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/candidates/block/${action.payload}`,
      method: 'PUT',
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    yield put(actions.blockCandidateSuccess(response.data.candidate));
    yield put(actions.getCandidate());
    toast.success('Candidate blocked successfully');
  } catch (error) {
    console.error('Block Candidate Error:', error);
    yield put(actions.blockCandidateFail(error.message));
    toast.error(error.message || 'Failed to block candidate');
  }
}

// REACTIVATE Candidate
function* reactivateCandidateSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/candidates/reactivate/${action.payload}`,
      method: 'PUT',
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    yield put(actions.reactivateCandidateSuccess(response.data.candidate));
    yield put(actions.getCandidate());
    toast.success('Candidate reactivated successfully');
  } catch (error) {
    console.error('Reactivate Candidate Error:', error);
    yield put(actions.reactivateCandidateFail(error.message));
    toast.error(error.message || 'Failed to reactivate candidate');
  }
}

// GET Candidate Count
function* totalCountSaga() {
  try {
    const params = {
      api: `${config.configApi}/candidates/count`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const count = response.count || response.data?.count || 0;
    yield put(actions.totalCountSuccess({ count }));
  } catch (error) {
    yield put(actions.totalCountFail(error.message));
    toast.error(error.message || 'Failed to get count');
  }
}

export default function* CandidateActionWatcher() {
  yield takeEvery('candidate/getCandidate', getCandidateSaga);
  yield takeEvery('candidate/totalCount', totalCountSaga);
  yield takeEvery('candidate/addCandidate', addCandidateSaga);
  yield takeEvery('candidate/getCandidateById', getCandidateByIdSaga);
  yield takeEvery('candidate/updateCandidate', updateCandidateSaga);
  yield takeEvery('candidate/deleteCandidate', deleteCandidateSaga);
  yield takeEvery('candidate/blockCandidate', blockCandidateSaga);
  yield takeEvery('candidate/reactivateCandidate', reactivateCandidateSaga);
}