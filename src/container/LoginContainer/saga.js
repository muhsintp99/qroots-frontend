import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../api';
import config from '../../config';
import {
  userLogin,
  loginSuccess,
  loginFail
} from './slice';

function* login(action) {
  try {
    const params = {
      api: `${config.configApi}/users/login`,
      method: 'POST',
      successAction: loginSuccess,
      failAction: loginFail,
      authorization: 'Basic',
      body: action.payload,
    };

    const res = yield call(commonApi, params);

    if (res?.token) {
      yield call([localStorage, 'setItem'], 'adminUser', JSON.stringify(res));
      yield call([localStorage, 'setItem'], 'adminToken', res.token);

      yield put(loginSuccess(res));

      if (action.payload.navigate) {
        yield call(action.payload.navigate, '/');
      }

      yield call(toast.success, 'Login successful', { autoClose: 3000 });
    } else {
      yield put(loginFail(res));
      yield call(toast.error, 'Login failed. Please try again.', { autoClose: 3000 });
    }

  } catch (error) {
    yield put(loginFail(error));
    yield call(toast.error, 'Login failed. Please try again.', { autoClose: 3000 });
  }
}

// function* login(action) {
//   try {
//     const { email, password, navigate } = action.payload;

//     let res;

//     // Try user login first
//     try {
//       const userParams = {
//         api: `${config.configApi}/users/login`,
//         method: 'POST',
//         authorization: 'Basic',
//         body: { email, password },
//       };
//       res = yield call(commonApi, userParams);
//     } catch (userError) {
//       // Try candidate login if user login fails
//       const candidateParams = {
//         api: `${config.configApi}/candidates/login`,
//         method: 'POST',
//         authorization: 'Basic',
//         body: { email, password },
//       };
//       res = yield call(commonApi, candidateParams);
//     }

//     // If login success
//     if (res?.token) {
//       yield call([localStorage, 'setItem'], 'userData', JSON.stringify(res));
//       yield call([localStorage, 'setItem'], 'userToken', res.token);
//       yield put(loginSuccess(res));

//       // Navigate based on userType
//       if (res.userType === 'admin' || res.userType === 'licensee') {
//         yield call(navigate, '/dashboard');
//       } else if (res.userType === 'candidate') {
//         yield call(navigate, '/candidate/dashboard');
//       } else {
//         yield call(navigate, '/');
//       }

//       yield call(toast.success, 'Login successful', { autoClose: 3000 });
//     } else {
//       yield put(loginFail('Invalid login'));
//       yield call(toast.error, 'Login failed. Please try again.', { autoClose: 3000 });
//     }

//   } catch (error) {
//     yield put(loginFail(error));
//     yield call(toast.error, 'Login failed. Please try again.', { autoClose: 3000 });
//   }
// }


export default function* LoginActionWatcher() {
  yield takeEvery(userLogin.type, login);
}
