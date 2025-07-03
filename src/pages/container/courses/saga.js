import { call, put, takeEvery } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

// GET All Courses
function* getCourseSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/courses/`,
      method: 'GET',
      authorization: false,
      params: action.payload,
    };
    const response = yield call(commonApi, params);
    if (!response.data) throw new Error('No data returned');
    yield put(actions.getCourseSuccess(response));
  } catch (error) {
    yield put(actions.getCourseFail(error.message));
    toast.error(error.message || 'Failed to load courses');
  }
}

// GET Course by ID
function* getCourseByIdSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/courses/${action.payload}`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const item = response.data || response;
    yield put(actions.getCourseByIdSuccess(item));
  } catch (error) {
    yield put(actions.getCourseByIdFail(error.message));
    toast.error(error.message || 'Failed to load course');
  }
}

// ADD Course
function* addCourseSaga(action) {
  try {
    const { title, shortDescription, fullDescription, duration, category, mode, fees, image, syllabus, prerequisites, tags, visible, createdBy, updatedBy } = action.payload;
    const formData = new FormData();
    formData.append('title', title || '');
    formData.append('shortDescription', shortDescription || '');
    formData.append('fullDescription', fullDescription || '');
    formData.append('duration', duration || '');
    formData.append('category', category || '');
    formData.append('mode', mode || '');
    formData.append('fees', fees || 0);
    if (image) formData.append('image', image);
    syllabus?.forEach(item => formData.append('syllabus[]', item));
    prerequisites?.forEach(item => formData.append('prerequisites[]', item));
    tags?.forEach(item => formData.append('tags[]', item));
    formData.append('visible', visible !== undefined ? visible : true);
    formData.append('createdBy', createdBy || 'admin');
    formData.append('updatedBy', updatedBy || 'admin');

    const params = {
      api: `${config.configApi}/courses`,
      method: 'POST',
      body: formData,
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    yield put(actions.addCourseSuccess(response.data));
    toast.success('Course added successfully');
  } catch (error) {
    yield put(actions.addCourseFail(error.message));
    toast.error(error.message || 'Failed to add course');
  }
}

// UPDATE Course
function* updateCourseSaga(action) {
  try {
    console.log('updateCourseSaga payload:', action.payload);
    const { _id, title, shortDescription, fullDescription, duration, category, mode, fees, image, syllabus, prerequisites, tags, visible, updatedBy } = action.payload;

    if (!_id) {
      throw new Error('Missing course ID in payload');
    }

    const formData = new FormData();
    if (title) formData.append('title', title);
    if (shortDescription) formData.append('shortDescription', shortDescription);
    if (fullDescription) formData.append('fullDescription', fullDescription);
    if (duration) formData.append('duration', duration);
    if (category) formData.append('category', category);
    if (mode) formData.append('mode', mode);
    if (fees !== undefined) formData.append('fees', fees);
    if (image) formData.append('image', image);
    if (syllabus) syllabus.forEach(item => formData.append('syllabus[]', item));
    if (prerequisites) prerequisites.forEach(item => formData.append('prerequisites[]', item));
    if (tags) tags.forEach(item => formData.append('tags[]', item));
    if (visible !== undefined) formData.append('visible', visible);
    if (updatedBy) formData.append('updatedBy', updatedBy);

    const params = {
      api: `${config.configApi}/courses/${_id}`,
      method: 'PUT',
      body: formData,
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    console.log('updateCourseSaga response.data:', response.data); // Debug log
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response: missing course data or _id');
    }
    yield put(actions.updateCourseSuccess(response.data));
    toast.success('Course updated successfully');
  } catch (error) {
    console.error('updateCourseSaga error:', error);
    yield put(actions.updateCourseFail(error.message));
    toast.error(error.message || 'Failed to update course');
  }
}

// DELETE Course
function* deleteCourseSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/courses/${action.payload}`,
      method: 'DELETE',
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    yield put(actions.deleteCourseSuccess(action.payload));
    toast.success('Course permanently deleted successfully');
  } catch (error) {
    yield put(actions.deleteCourseFail(error.message));
    toast.error(error.message || 'Failed to delete course');
  }
}

// GET Total Course Count
function* totalCourseCountSaga() {
  try {
    const params = {
      api: `${config.configApi}/courses/`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const count = response.total || response.data?.length || 0;
    yield put(actions.totalCourseCountSuccess({ count }));
  } catch (error) {
    yield put(actions.totalCourseCountFail(error.message));
    toast.error(error.message || 'Failed to get course count');
  }
}

// Watcher
export default function* CourseActionWatcher() {
  yield takeEvery('courses/getCourse', getCourseSaga);
  yield takeEvery('courses/getCourseById', getCourseByIdSaga);
  yield takeEvery('courses/addCourse', addCourseSaga);
  yield takeEvery('courses/updateCourse', updateCourseSaga);
  yield takeEvery('courses/deleteCourse', deleteCourseSaga);
  yield takeEvery('courses/totalCourseCount', totalCourseCountSaga);
}