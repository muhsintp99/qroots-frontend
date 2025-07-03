import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

// GET All Packages
function* getPackagesSaga() {
  try {
    const params = {
      api: `${config.configApi}/packages`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const packages = response.packages || [];
    console.log("reponce ",packages)
    yield put(actions.getPackagesSuccess(packages));
  } catch (error) {
    yield put(actions.getPackagesFail(error.message));
    toast.error(error.message || 'Failed to load packages');
  }
}

// GET Package By ID
function* getPackageByIdSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/packages/${action.payload}`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    yield put(actions.getPackageByIdSuccess(response.data));
  } catch (error) {
    yield put(actions.getPackageByIdFail(error.message));
    toast.error(error.message || 'Failed to get package');
  }
}

// ADD Package
function* addPackageSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/packages`,
      method: 'POST',
      authorization: 'Bearer',
      body: action.payload,
    };
    const response = yield call(commonApi, params);
    yield put(actions.addPackageSuccess(response.package));
    yield put(actions.getPackages());
    toast.success('Package added successfully');
  } catch (error) {
    yield put(actions.addPackageFail(error.message));
    toast.error(error.message || 'Failed to add package');
  }
}


// UPDATE Package
function* updatePackageSaga(action) {
  try {
    const { id, data } = action.payload;
    const params = {
      api: `${config.configApi}/packages/${id}`,
      method: 'PUT',
      authorization: 'Bearer',
      body: data,
    };
    const response = yield call(commonApi, params);
    yield put(actions.updatePackageSuccess(response.package));
    yield put(actions.getPackages());
    toast.success('Package updated successfully');
  } catch (error) {
    yield put(actions.updatePackageFail(error.message));
    toast.error(error.message || 'Failed to update package');
  }
}


// DELETE Package
function* deletePackageSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/packages/${action.payload}`,
      method: 'DELETE',
      authorization: 'Bearer',
    };
    yield call(commonApi, params);
    yield put(actions.deletePackageSuccess(action.payload));
    yield put(actions.getPackages());
    toast.success('Package deleted successfully');
  } catch (error) {
    yield put(actions.deletePackageFail(error.message));
    toast.error(error.message || 'Failed to delete package');
  }
}

export default function* PackageActionWatcher() {
  yield takeEvery('packages/getPackages', getPackagesSaga);
  yield takeEvery('packages/getPackageById', getPackageByIdSaga);
  yield takeEvery('packages/addPackage', addPackageSaga);
  yield takeEvery('packages/updatePackage', updatePackageSaga);
  yield takeEvery('packages/deletePackage', deletePackageSaga);
}
