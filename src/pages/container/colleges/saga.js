import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

// Helper function to create FormData
function createCollegeFormData(payload) {
  const formData = new FormData();
  
  // Handle each field appropriately
  Object.keys(payload).forEach(key => {
    if (key === 'id') return; // Skip id for FormData
    
    const value = payload[key];
    if (value !== null && value !== undefined && value !== '') {
      if (key === 'courses' && Array.isArray(value)) {
        // Handle courses array by appending only _id strings
        value.forEach((course, index) => {
          const courseId = typeof course === 'object' ? course._id : course;
          if (courseId) {
            formData.append(`courses[${index}]`, courseId);
          }
        });
      } else if (Array.isArray(value)) {
        // Handle other arrays (facilities, services)
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (key === 'image' && value instanceof File) {
        // Handle file uploads
        formData.append(key, value);
      } else {
        // Handle other fields
        formData.append(key, value);
      }
    }
  });
  
  return formData;
}

// GET All Colleges
function* getCollegesSaga(action) {
  console.log('getCollegesSaga triggered');
  try {
    const queryParams = action.payload ? new URLSearchParams(action.payload).toString() : '';
    const apiUrl = queryParams ? 
      `${config.configApi}/college?${queryParams}` : 
      `${config.configApi}/college`;
      
    const params = {
      api: apiUrl,
      method: 'GET',
      authorization: false,
    };
    
    const response = yield call(commonApi, params);
    console.log('GET Colleges Response:', response);
    
    // Handle both paginated and non-paginated responses
    const colleges = response.colleges || response.data || response || [];
    const pagination = response.colleges ? {
      totalPages: response.totalPages,
      currentPage: response.currentPage,
      total: response.total
    } : null;
    
    yield put(actions.getCollegesSuccess({ colleges, pagination }));
  } catch (error) {
    console.error('GET Colleges Error:', error.response || error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to load colleges';
    yield put(actions.getCollegesFail(errorMessage));
    toast.error(errorMessage);
  }
}

// GET College By ID
function* getCollegeByIdSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/college/${action.payload}`,
      method: 'GET',
      authorization: false,
    };
    
    const response = yield call(commonApi, params);
    const college = response.data || response;
    yield put(actions.getCollegeByIdSuccess(college));
  } catch (error) {
    console.error('GET College By ID Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to get college';
    yield put(actions.getCollegeByIdFail(errorMessage));
    toast.error(errorMessage);
  }
}

// ADD College
function* addCollegeSaga(action) {
  try {
    console.log('Add College Payload:', action.payload);
    
    const formData = createCollegeFormData(action.payload);
    
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const params = {
      api: `${config.configApi}/college`,
      method: 'POST',
      authorization: 'Bearer',
      body: formData,
    };
    
    const response = yield call(commonApi, params);
    yield put(actions.addCollegeSuccess(response.data || response));
    yield put(actions.getColleges());
    toast.success('College added successfully');
  } catch (error) {
    console.error('Add College Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to add college';
    yield put(actions.addCollegeFail(errorMessage));
    toast.error(errorMessage);
  }
}

// UPDATE College
function* updateCollegeSaga(action) {
  try {
    console.log('Update College Payload:', action.payload);
    
    const { id, ...updateData } = action.payload;
    const formData = createCollegeFormData(updateData);
    
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const params = {
      api: `${config.configApi}/college/${id}`,
      method: 'PUT',
      body: formData,
      authorization: 'Bearer',
    };
    
    const response = yield call(commonApi, params);
    yield put(actions.updateCollegeSuccess(response.data || response));
    yield put(actions.getColleges());
    toast.success('College updated successfully');
  } catch (error) {
    console.error('Update College Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Update failed';
    yield put(actions.updateCollegeFail(errorMessage));
    toast.error(errorMessage);
  }
}

// SOFT DELETE College
function* softDeleteCollegeSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/college/${action.payload}`,
      method: 'PATCH',
      authorization: 'Bearer',
      body: { updatedBy: 'admin' }
    };
    
    const response = yield call(commonApi, params);
    yield put(actions.softDeleteCollegeSuccess(response.data || response));
    yield put(actions.getColleges());
    toast.success('College soft deleted successfully');
  } catch (error) {
    console.error('Soft Delete College Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Soft delete failed';
    yield put(actions.softDeleteCollegeFail(errorMessage));
    toast.error(errorMessage);
  }
}

// HARD DELETE College
function* deleteCollegeSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/college/${action.payload}`,
      method: 'DELETE',
      authorization: 'Bearer',
    };
    
    yield call(commonApi, params);
    yield put(actions.deleteCollegeSuccess(action.payload));
    yield put(actions.getColleges());
    toast.success('College deleted successfully');
  } catch (error) {
    console.error('Delete College Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Delete failed';
    yield put(actions.deleteCollegeFail(errorMessage));
    toast.error(errorMessage);
  }
}

// GET College Count
function* totalCountSaga() {
  try {
    const params = {
      api: `${config.configApi}/college/count`,
      method: 'GET',
      authorization: false,
    };
    
    const response = yield call(commonApi, params);
    const count = response.count || response.data?.count || 0;
    yield put(actions.totalCountSuccess({ count }));
  } catch (error) {
    console.error('Get College Count Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to get college count';
    yield put(actions.totalCountFail(errorMessage));
    toast.error(errorMessage);
  }
}

export default function* CollegeActionWatcher() {
  yield takeEvery('colleges/getColleges', getCollegesSaga);
  yield takeEvery('colleges/totalCount', totalCountSaga);
  yield takeEvery('colleges/addCollege', addCollegeSaga);
  yield takeEvery('colleges/getCollegeById', getCollegeByIdSaga);
  yield takeEvery('colleges/updateCollege', updateCollegeSaga);
  yield takeEvery('colleges/softDeleteCollege', softDeleteCollegeSaga);
  yield takeEvery('colleges/deleteCollege', deleteCollegeSaga);
}