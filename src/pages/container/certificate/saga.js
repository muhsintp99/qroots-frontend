import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

const API_BASE = config.configApi;
const ENDPOINTS = {
  CERTIFICATES: `${API_BASE}/certificates`,
  CERTIFICATE_BY_ID: (id) => `${API_BASE}/certificates/${id}`,
};

function* handleApiError(error, failAction) {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  yield put(failAction(errorMessage));
  toast.error(errorMessage);
}

function* fetchCertificatesSaga() {
  console.log('Fetching certificates...');
  try {
    const params = { api: ENDPOINTS.CERTIFICATES, method: 'GET' };
    console.log('API params:', params);
    const response = yield call(commonApi, params);
    yield put(actions.getCertificatesSuccess(response));
  } catch (error) {
    console.error('Fetch certificates error:', error);
    yield* handleApiError(error, actions.getCertificatesFail);
  }
}

function* fetchCertificateByIdSaga(action) {
  try {
    const params = { api: ENDPOINTS.CERTIFICATE_BY_ID(action.payload), method: 'GET' };
    const response = yield call(commonApi, params);
    yield put(actions.getCertificateByIdSuccess(response));
  } catch (error) {
    yield* handleApiError(error, actions.getCertificateByIdFail);
  }
}

function* createCertificateSaga(action) {
  try {
    const params = { api: ENDPOINTS.CERTIFICATES, method: 'POST', body: action.payload };
    const response = yield call(commonApi, params);
    // Assuming API returns { data: certificate }
    const certificate = response.data || response;
    if (!certificate || !certificate._id) {
      throw new Error('Invalid response from server');
    }
    yield put(actions.createCertificateSuccess(certificate));
    toast.success('Certificate created successfully');
  } catch (error) {
    yield* handleApiError(error, actions.createCertificateFail);
  }
}

function* updateCertificateSaga(action) {
  try {
    const { _id, ...data } = action.payload;
    const params = { api: ENDPOINTS.CERTIFICATE_BY_ID(_id), method: 'PUT', body: data };
    const response = yield call(commonApi, params);
    yield put(actions.updateCertificateSuccess(response));
    toast.success('Certificate updated successfully');
  } catch (error) {
    yield* handleApiError(error, actions.updateCertificateFail);
  }
}

function* deleteCertificateSaga(action) {
  try {
    const params = { api: ENDPOINTS.CERTIFICATE_BY_ID(action.payload), method: 'DELETE' };
    yield call(commonApi, params);
    yield put(actions.deleteCertificateSuccess(action.payload));
    toast.success('Certificate deleted successfully');
  } catch (error) {
    yield* handleApiError(error, actions.deleteCertificateFail);
  }
}

export default function* CertificateWatcherSaga() {
  yield takeEvery('certificates/getCertificates', fetchCertificatesSaga);
  yield takeEvery('certificates/getCertificateById', fetchCertificateByIdSaga);
  yield takeEvery('certificates/createCertificate', createCertificateSaga);
  yield takeEvery('certificates/updateCertificate', updateCertificateSaga);
  yield takeEvery('certificates/deleteCertificate', deleteCertificateSaga);
}