import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import studentReducer from '../features/student/studentSlice';
import masterReducer from '../features/master/masterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    master: masterReducer,
  },
});