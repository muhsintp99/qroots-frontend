import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    selectedUser: null,
    userCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSelectedUser: (state) => { state.selectedUser = null; },
    resetState: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.userCount = 0;
      state.loading = false;
      state.error = null;
    },
    addUser: (state) => { state.loading = true; state.error = null; },
    addUserSuccess: (state, action) => {
      state.loading = false;
      state.users.push(action.payload.data);
      state.userCount = action.payload.count || state.userCount + 1;
      state.error = null;
    },
    addUserFail: (state, action) => { state.loading = false; state.error = action.payload; },
    getUsers: (state) => { state.loading = true; state.error = null; },
    getUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload.data;
      state.userCount = action.payload.count || action.payload.data.length;
      state.error = null;
    },
    getUsersFail: (state, action) => { state.loading = false; state.error = action.payload; },
    getUserById: (state) => { state.loading = true; state.error = null; },
    getUserByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedUser = action.payload;
      state.error = null;
    },
    getUserByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.selectedUser = null;
    },
    updateUser: (state) => { state.loading = true; state.error = null; },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.users = state.users.map((item) =>
        item._id === updated._id ? updated : item
      );
      if (state.selectedUser?._id === updated._id) {
        state.selectedUser = updated;
      }
      state.error = null;
    },
    updateUserFail: (state, action) => { state.loading = false; state.error = action.payload; },
    deleteUser: (state) => { state.loading = true; state.error = null; },
    deleteUserSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.users = state.users.map((item) =>
        item._id === updated._id ? updated : item
      );
      state.userCount = Math.max(0, state.userCount - 1);
      if (state.selectedUser?._id === updated._id) {
        state.selectedUser = null;
      }
      state.error = null;
    },
    deleteUserFail: (state, action) => { state.loading = false; state.error = action.payload; },
    reactivateUser: (state) => { state.loading = true; state.error = null; },
    reactivateUserSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.users = state.users.map((item) =>
        item._id === updated._id ? updated : item
      );
      if (state.selectedUser?._id === updated._id) {
        state.selectedUser = updated;
      }
      state.error = null;
    },
    reactivateUserFail: (state, action) => { state.loading = false; state.error = action.payload; },
    hardDeleteUser: (state) => { state.loading = true; state.error = null; },
    hardDeleteUserSuccess: (state, action) => {
      state.loading = false;
      state.users = state.users.filter((item) => item._id !== action.payload);
      state.userCount = Math.max(0, state.userCount - 1);
      if (state.selectedUser?._id === action.payload) {
        state.selectedUser = null;
      }
      state.error = null;
    },
    hardDeleteUserFail: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

export const {
  clearError,
  clearSelectedUser,
  resetState,
  addUser,
  addUserSuccess,
  addUserFail,
  getUsers,
  getUsersSuccess,
  getUsersFail,
  getUserById,
  getUserByIdSuccess,
  getUserByIdFail,
  updateUser,
  updateUserSuccess,
  updateUserFail,
  deleteUser,
  deleteUserSuccess,
  deleteUserFail,
  reactivateUser,
  reactivateUserSuccess,
  reactivateUserFail,
  hardDeleteUser,
  hardDeleteUserSuccess,
  hardDeleteUserFail,
} = userSlice.actions;

export default userSlice.reducer;