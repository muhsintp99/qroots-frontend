import { createSlice } from '@reduxjs/toolkit';

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    selectedCourse: {},
    courseCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Create
    addCourse: state => { state.loading = true; },
    addCourseSuccess: (state, action) => {
      state.loading = false;
      state.courses.push(action.payload);
      state.courseCount += 1;
    },
    addCourseFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get all
    getCourse: state => { state.loading = true; },
    getCourseSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        console.warn('Received array payload, expected { data, total }:', action.payload);
        state.courses = action.payload;
        state.courseCount = action.payload.length || 0;
      } else {
        state.courses = action.payload.data || [];
        state.courseCount = action.payload.total || action.payload.data?.length || 0;
      }
      state.error = null;
    },
    getCourseFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get by ID
    getCourseById: state => { state.loading = true; },
    getCourseByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedCourse = action.payload;
      state.error = null;
    },
    getCourseByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Total Count
    totalCourseCount: state => { state.loading = true; },
    totalCourseCountSuccess: (state, action) => {
      state.loading = false;
      state.courseCount = action.payload.count;
    },
    totalCourseCountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update
    updateCourse: state => { state.loading = true; },
    updateCourseSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      console.log('updateCourseSuccess payload:', updated); // Debug log
      if (!updated || !updated._id) {
        console.error('Invalid payload in updateCourseSuccess: missing _id');
        state.error = 'Invalid course data received';
        return;
      }
      state.courses = state.courses.map((item) =>
        item._id === updated._id ? updated : item
      );
      if (state.selectedCourse?._id === updated._id) {
        state.selectedCourse = updated;
      }
    },
    updateCourseFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete
    deleteCourse: state => { state.loading = true; },
    deleteCourseSuccess: (state, action) => {
      const deletedId = action.payload;
      state.loading = false;
      state.courses = state.courses.filter((c) => c._id !== deletedId);
      if (state.selectedCourse?._id === deletedId) {
        state.selectedCourse = {};
      }
      state.courseCount -= 1;
    },
    deleteCourseFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getCourse,
  getCourseSuccess,
  getCourseFail,
  addCourse,
  addCourseSuccess,
  addCourseFail,
  getCourseById,
  getCourseByIdSuccess,
  getCourseByIdFail,
  totalCourseCount,
  totalCourseCountSuccess,
  totalCourseCountFail,
  updateCourse,
  updateCourseFail,
  deleteCourse,
  deleteCourseSuccess,
  deleteCourseFail,
} = courseSlice.actions;

export default courseSlice.reducer;