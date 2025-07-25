import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    userCount: 0,
    loading: false,
    error: null,
    isSuccess: false,
    isError: false,
  },
  reducers: {
    getUsers: (state) => {
      state.loading = true;
      state.error = null;
      state.isSuccess = false;
      state.isError = false;
    },
    getUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      state.userCount = action.payload.count;
      state.isSuccess = true;
      state.isError = false;
    },
    getUsersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isSuccess = false;
      state.isError = true;
    },
    addUser: (state) => {
      state.loading = true;
      state.error = null;
      state.isSuccess = false;
      state.isError = false;
    },
    addUserSuccess: (state, action) => {
      state.loading = false;
      state.users.unshift(action.payload);
      state.userCount += 1;
      state.isSuccess = true;
      state.isError = false;
    },
    addUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isSuccess = false;
      state.isError = true;
    },
    updateUser: (state) => {
      state.loading = true;
      state.error = null;
      state.isSuccess = false;
      state.isError = false;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.users = state.users.map((u) => (u._id === action.payload._id ? action.payload : u));
      state.isSuccess = true;
      state.isError = false;
    },
    updateUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isSuccess = false;
      state.isError = true;
    },
    deleteUser: (state) => {
      state.loading = true;
      state.error = null;
      state.isSuccess = false;
      state.isError = false;
    },
    deleteUserSuccess: (state, action) => {
      state.loading = false;
      state.users = state.users.filter((u) => u._id !== action.payload);
      state.userCount -= 1;
      state.isSuccess = true;
      state.isError = false;
    },
    deleteUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isSuccess = false;
      state.isError = true;
    },
    deactivateUser: (state) => {
      state.loading = true;
      state.error = null;
      state.isSuccess = false;
      state.isError = false;
    },
    deactivateUserSuccess: (state, action) => {
      state.loading = false;
      state.users = state.users.map((u) =>
        u._id === action.payload ? { ...u, status: 'blocked', isDeleted: true } : u
      );
      state.isSuccess = true;
      state.isError = false;
    },
    deactivateUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isSuccess = false;
      state.isError = true;
    },
    reactivateUser: (state) => {
      state.loading = true;
      state.error = null;
      state.isSuccess = false;
      state.isError = false;
    },
    reactivateUserSuccess: (state, action) => {
      state.loading = false;
      state.users = state.users.map((u) =>
        u._id === action.payload ? { ...u, status: 'active', isDeleted: false } : u
      );
      state.isSuccess = true;
      state.isError = false;
    },
    reactivateUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isSuccess = false;
      state.isError = true;
    },
    clearError: (state) => {
      state.error = null;
      state.isError = false;
    },
  },
});

export const {
  getUsers, getUsersSuccess, getUsersFail,
  addUser, addUserSuccess, addUserFail,
  updateUser, updateUserSuccess, updateUserFail,
  deleteUser, deleteUserSuccess, deleteUserFail,
  deactivateUser, deactivateUserSuccess, deactivateUserFail,
  reactivateUser, reactivateUserSuccess, reactivateUserFail,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;