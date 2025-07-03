import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

// GET All Coupons
function* getCouponsSaga(action) {
  try {
    console.debug('getCouponsSaga triggered with action:', action); // Debug log
    const params = {
      api: `${config.configApi}/coupons`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    console.debug('getCoupons API response:', response); // Debug log
    // Handle various response structures
    const coupons = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
      ? response.data
      : Array.isArray(response)
      ? response
      : [];
    if (!coupons.length && response) {
      console.warn('No coupons found in response:', response); // Debug log
    }
    yield put(actions.getCouponsSuccess(coupons));
  } catch (error) {
    console.error('getCouponsSaga error:', error); // Debug log
    yield put(actions.getCouponsFail(error.message || 'Failed to load coupons'));
    toast.error(error.message || 'Failed to load coupons');
  }
}

// GET Coupon By ID
function* getCouponByIdSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/coupons/${action.payload}`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    console.debug('getCouponById API response:', response); // Debug log
    const coupon = response.data?.data || response.data || response;
    yield put(actions.getCouponByIdSuccess(coupon));
  } catch (error) {
    console.error('getCouponByIdSaga error:', error); // Debug log
    yield put(actions.getCouponByIdFail(error.message || 'Failed to get coupon'));
    toast.error(error.message || 'Failed to get coupon');
  }
}

// ADD Coupon
function* addCouponSaga(action) {
  try {
    const { couponTitle, code, discount, endDate, status } = action.payload;
    const params = {
      api: `${config.configApi}/coupons`,
      method: 'POST',
      authorization: 'Bearer',
      body: {
        couponTitle,
        code: code?.toUpperCase(),
        discount,
        endDate,
        status,
      },
    };
    const response = yield call(commonApi, params);
    console.debug('addCoupon API response:', response); // Debug log
    const coupon = response.data?.data?.coupon || response.data?.coupon || response;
    yield put(actions.addCouponSuccess(coupon));
    yield put(actions.getCoupons());
    toast.success('Coupon added successfully');
  } catch (error) {
    console.error('addCouponSaga error:', error); // Debug log
    yield put(actions.addCouponFail(error.message || 'Failed to add coupon'));
    toast.error(error.message || 'Failed to add coupon');
  }
}

// UPDATE Coupon
function* updateCouponSaga(action) {
  try {
    const { id, data } = action.payload;
    const { couponTitle, code, discount, endDate, status } = data;
    const params = {
      api: `${config.configApi}/coupons/${id}`,
      method: 'PUT',
      authorization: 'Bearer',
      body: {
        couponTitle,
        code: code?.toUpperCase(),
        discount,
        endDate,
        status,
      },
    };
    const response = yield call(commonApi, params);
    console.debug('updateCoupon API response:', response); // Debug log
    const coupon = response.data?.data?.coupon || response.data?.coupon || response;
    yield put(actions.updateCouponSuccess(coupon));
    yield put(actions.getCoupons());
    toast.success('Coupon updated successfully');
  } catch (error) {
    console.error('updateCouponSaga error:', error); // Debug log
    yield put(actions.updateCouponFail(error.message || 'Failed to update coupon'));
    toast.error(error.message || 'Failed to update coupon');
  }
}

// DELETE Coupon
function* deleteCouponSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/coupons/${action.payload}`,
      method: 'DELETE',
      authorization: 'Bearer',
    };
    yield call(commonApi, params);
    console.debug('deleteCoupon API response:', 'Success'); // Debug log
    yield put(actions.deleteCouponSuccess(action.payload));
    yield put(actions.getCoupons());
    toast.success('Coupon deleted successfully');
  } catch (error) {
    console.error('deleteCouponSaga error:', error); // Debug log
    yield put(actions.deleteCouponFail(error.message || 'Failed to delete coupon'));
    toast.error(error.message || 'Failed to delete coupon');
  }
}

// GET Coupon Count
function* totalCountSaga() {
  try {
    const params = {
      api: `${config.configApi}/coupons/count`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    console.debug('totalCount API response:', response); // Debug log
    const count = response.data?.data?.count || response.data?.count || response.count || 0;
    yield put(actions.totalCountSuccess({ count }));
  } catch (error) {
    console.error('totalCountSaga error:', error); // Debug log
    yield put(actions.totalCountFail(error.message || 'Failed to get coupon count'));
    toast.error(error.message || 'Failed to get coupon count');
  }
}

export default function* CouponActionWatcher() {
  yield takeEvery('coupons/getCoupons', getCouponsSaga); // Ensure correct action type
  yield takeEvery('coupons/totalCount', totalCountSaga);
  yield takeEvery('coupons/addCoupon', addCouponSaga);
  yield takeEvery('coupons/getCouponById', getCouponByIdSaga);
  yield takeEvery('coupons/updateCoupon', updateCouponSaga);
  yield takeEvery('coupons/deleteCoupon', deleteCouponSaga);
}