import { takeEvery, call, put, retry } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../../container/api';
import config from '../../../../config';
import * as actions from './slice';

function createUserFormData(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === '_id' || value === null || value === undefined) return;
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, JSON.stringify(value));
    }
  });
  return formData;
}

function* getUsersSaga(action) {
  try {
    const { page = 1, limit = 10 } = action.payload || {};
    const response = yield retry(3, 1000, commonApi, {
      api: `${config.configApi}/users`,
      method: 'GET',
      authorization: 'Bearer',
      body: { page, limit },
    });
    yield put(actions.getUsersSuccess({
      data: response.users || [],
      count: response.count || 0,
    }));
  } catch (error) {
    const err = error.message || 'Failed to load users';
    yield put(actions.getUsersFail({ message: err, status: error.status }));
    toast.error(err);
  }
}

function* getUserByIdSaga(action) {
  try {
    const response = yield retry(3, 1000, commonApi, {
      api: `${config.configApi}/users/${action.payload}`,
      method: 'GET',
      authorization: 'Bearer',
    });
    yield put(actions.getUserByIdSuccess(response.user));
  } catch (error) {
    const err = error.message || 'Failed to fetch user';
    yield put(actions.getUserByIdFail({ message: err, status: error.status }));
    toast.error(err);
  }
}

function* addUserSaga(action) {
  try {
    const formData = createUserFormData(action.payload);
    const response = yield retry(3, 1000, commonApi, {
      api: `${config.configApi}/users`,
      method: 'POST',
      authorization: 'Bearer',
      body: formData,
    });
    yield put(actions.addUserSuccess({
      data: response.user,
      count: response.count || 0,
    }));
    toast.success('User added successfully');
  } catch (error) {
    const err = error.message || 'Failed to add user';
    yield put(actions.addUserFail({ message: err, status: error.status }));
    toast.error(err);
  }
}

function* updateUserSaga(action) {
  try {
    const { _id, ...updateData } = action.payload;
    const formData = createUserFormData(updateData);
    const response = yield retry(3, 1000, commonApi, {
      api: `${config.configApi}/users/${_id}`,
      method: 'PUT',
      authorization: 'Bearer',
      body: formData,
    });
    yield put(actions.updateUserSuccess(response.user));
    toast.success('User updated successfully');
  } catch (error) {
    const err = error.message || 'Failed to update user';
    yield put(actions.updateUserFail({ message: err, status: error.status }));
    toast.error(err);
  }
}

function* deleteUserSaga(action) {
  try {
    const response = yield retry(3, 1000, commonApi, {
      api: `${config.configApi}/users/${action.payload}/delete`,
      method: 'PATCH',
      authorization: 'Bearer',
    });
    yield put(actions.deleteUserSuccess(response.user));
    toast.success('User deactivated successfully');
    yield put(actions.getUsers());
  } catch (error) {
    const err = error.message || 'Failed to deactivate user';
    yield put(actions.deleteUserFail({ message: err, status: error.status }));
    toast.error(err);
  }
}

function* reactivateUserSaga(action) {
  try {
    const response = yield retry(3, 1000, commonApi, {
      api: `${config.configApi}/users/${action.payload}/reactivate`,
      method: 'PATCH',
      authorization: 'Bearer',
    });
    yield put(actions.reactivateUserSuccess(response.user));
    toast.success('User reactivated successfully');
    yield put(actions.getUsers());
  } catch (error) {
    const err = error.message || 'Failed to reactivate user';
    yield put(actions.reactivateUserFail({ message: err, status: error.status }));
    toast.error(err);
  }
}

function* hardDeleteUserSaga(action) {
  try {
    yield retry(3, 1000, commonApi, {
      api: `${config.configApi}/users/${action.payload}`,
      method: 'DELETE',
      authorization: 'Bearer',
    });
    yield put(actions.hardDeleteUserSuccess(action.payload));
    toast.success('User permanently deleted successfully');
    yield put(actions.getUsers());
  } catch (error) {
    const err = error.message || 'Failed to permanently delete user';
    yield put(actions.hardDeleteUserFail({ message: err, status: error.status }));
    toast.error(err);
  }
}

export default function* UserActionWatcher() {
  yield takeEvery('users/getUsers', getUsersSaga);
  yield takeEvery('users/addUser', addUserSaga);
  yield takeEvery('users/getUserById', getUserByIdSaga);
  yield takeEvery('users/updateUser', updateUserSaga);
  yield takeEvery('users/deleteUser', deleteUserSaga);
  yield takeEvery('users/reactivateUser', reactivateUserSaga);
  yield takeEvery('users/hardDeleteUser', hardDeleteUserSaga);
}