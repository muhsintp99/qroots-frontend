import { call, put, takeEvery } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../../container/api';
import config from '../../../../config';
import {
  getUsers, getUsersSuccess, getUsersFail,
  addUser, addUserSuccess, addUserFail,
  updateUser, updateUserSuccess, updateUserFail,
  deleteUser, deleteUserSuccess, deleteUserFail,
  deactivateUser, deactivateUserSuccess, deactivateUserFail,
  reactivateUserSuccess,
  reactivateUserFail,
  reactivateUser,
} from './slice';

function* getUsersSaga({ payload }) {
  try {
    const res = yield call(commonApi, {
      api: `${config.configApi}/users`,
      method: 'GET',
      authorization: 'Bearer',
      successAction: getUsersSuccess,
      failAction: getUsersFail,
    });
    yield put(getUsersSuccess({ users: res.users, count: res.counts }));
    // yield call(toast.success, 'Users fetched successfully', { autoClose: 3000 });
  } catch (error) {
    yield put(getUsersFail(error.message));
    yield call(toast.error, error.message, { autoClose: 3000 });
  }
}

function* addUserSaga({ payload }) {
  console.log('addUserSaga triggered with payload:', payload);
  try {
    const formData = new FormData();
    formData.append('fname', payload.fname);
    formData.append('lname', payload.lname);
    formData.append('email', payload.email);
    formData.append('mobile', payload.mobile);
    formData.append('password', payload.password);
    formData.append('userType', 'licensee');
    formData.append('status', payload.status);
    if (payload.image) {
      formData.append('image', payload.image);
    }

    const res = yield call(commonApi, {
      api: `${config.configApi}/users/register`,
      method: 'POST',
      body: formData,
      authorization: 'Bearer',
      successAction: addUserSuccess,
      failAction: addUserFail,
    });
    console.log('API Response:', res.user);
    yield put(addUserSuccess(res.user));
    yield call(toast.success, 'Licensee registered successfully', { autoClose: 3000 });

    if (payload.onClose) {
      yield call(payload.onClose);
    }
  } catch (error) {
    yield put(addUserFail(error.message));
    yield call(toast.error, error.message, { autoClose: 3000 });
  }
}

function* updateUserSaga({ payload }) {
  try {
    const { _id, ...data } = payload;
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const res = yield call(commonApi, {
      api: `${config.configApi}/users/update`,
      method: 'PUT',
      body: formData,
      authorization: 'Bearer',
      successAction: updateUserSuccess,
      failAction: updateUserFail,
    });

    yield put(updateUserSuccess(res.user));
    yield call(toast.success, 'User updated successfully', { autoClose: 3000 });

    if (payload.onClose) {
      yield call(payload.onClose);
    }
  } catch (error) {
    yield put(updateUserFail(error.message));
    yield call(toast.error, error.message, { autoClose: 3000 });
  }
}

function* deleteUserSaga({ payload }) {
  try {
    yield call(commonApi, {
      api: `${config.configApi}/users/${payload.id}`,
      method: 'DELETE',
      authorization: 'Bearer',
      successAction: deleteUserSuccess,
      failAction: deleteUserFail,
    });

    yield put(deleteUserSuccess(payload.id));
    yield call(toast.success, 'User permanently deleted', { autoClose: 3000 });

    if (payload.onClose) {
      yield call(payload.onClose);
    }
  } catch (error) {
    yield put(deleteUserFail(error.message));
    yield call(toast.error, error.message, { autoClose: 3000 });
  }
}

function* deactivateUserSaga({ payload }) {
  try {
    const res = yield call(commonApi, {
      api: `${config.configApi}/users/block/${payload.id}`,
      method: 'PUT',
      authorization: 'Bearer',
      successAction: deactivateUserSuccess,
      failAction: deactivateUserFail,
    });

    yield put(deactivateUserSuccess(payload.id));
    yield call(toast.success, 'User deactivated successfully', { autoClose: 3000 });

    if (payload.onClose) {
      yield call(payload.onClose);
    }
  } catch (error) {
    yield put(deactivateUserFail(error.message));
    yield call(toast.error, error.message, { autoClose: 3000 });
  }
}

function* reactivateUserSaga({ payload }) {
  try {
    const res = yield call(commonApi, {
      api: `${config.configApi}/users/unblock/${payload.id}`,
      method: 'PUT',
      authorization: 'Bearer',
      successAction: reactivateUserSuccess,
      failAction: reactivateUserFail,
    });

    yield put(reactivateUserSuccess(payload.id));
    yield call(toast.success, 'User reactivated successfully', { autoClose: 3000 });

    if (payload.onClose) {
      yield call(payload.onClose);
    }
  } catch (error) {
    yield put(reactivateUserFail(error.message));
    yield call(toast.error, error.message, { autoClose: 3000 });
  }
}

export default function* userSagaWatcher() {
  yield takeEvery(getUsers.type, getUsersSaga);
  yield takeEvery(addUser.type, addUserSaga);
  yield takeEvery(updateUser.type, updateUserSaga);
  yield takeEvery(deleteUser.type, deleteUserSaga);
  yield takeEvery(deactivateUser.type, deactivateUserSaga);
  yield takeEvery(reactivateUser.type, reactivateUserSaga);
}