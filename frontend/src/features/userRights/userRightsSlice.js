import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user-rights/';

// for production use uncomment below one line
// const API_URL = '/api/user-rights/';
axios.defaults.withCredentials = true;

// Fetch Rights for a specific user (Admin usage)
export const fetchUserRights = createAsyncThunk('userRights/fetch', async (userId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token; // Assuming token mechanism if stored, or relying on cookies
    const response = await axios.get(API_URL + userId);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Save Rights (Admin usage)
export const saveUserRights = createAsyncThunk('userRights/save', async (data, thunkAPI) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Fetch Current User's Rights (For Navbar/Protection)
export const fetchMyPermissions = createAsyncThunk('userRights/fetchMy', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + 'me');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const userRightsSlice = createSlice({
  name: 'userRights',
  initialState: {
    rights: { permissions: [] }, // The rights being edited
    myPermissions: [], // The logged-in user's permissions
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
  },
  reducers: {
    resetRightsState: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRights.pending, (state) => { state.isLoading = true; })
      .addCase(fetchUserRights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rights = action.payload;
      })
      .addCase(saveUserRights.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Rights saved successfully';
      })
      .addCase(fetchMyPermissions.fulfilled, (state, action) => {
        state.myPermissions = action.payload;
      });
  }
});

export const { resetRightsState } = userRightsSlice.actions;
export default userRightsSlice.reducer;