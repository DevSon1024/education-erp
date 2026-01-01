import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import studentReducer from '../features/student/studentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
  },
});