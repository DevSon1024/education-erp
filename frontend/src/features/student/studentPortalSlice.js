import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL + '/student-portal/';
const API_URL = `${import.meta.env.VITE_API_URL}/student-portal/`;

// Fetch Dashboard Stats
export const fetchDashboardStats = createAsyncThunk(
    'studentPortal/fetchDashboardStats',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}dashboard`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch Course Details
export const fetchCourseDetails = createAsyncThunk(
    'studentPortal/fetchCourseDetails',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}course`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Submit Feedback - Although component might handle it, good to have here for consistency if needed
export const submitCourseFeedback = createAsyncThunk(
    'studentPortal/submitFeedback',
    async (feedbackData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}feedback`, feedbackData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const studentPortalSlice = createSlice({
    name: 'studentPortal',
    initialState: {
        stats: null,
        courseDetails: null,
        isLoading: false,
        isError: false,
        message: ''
    },
    reducers: {
        resetPortalState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Dashboard Stats
            .addCase(fetchDashboardStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Course Details
            .addCase(fetchCourseDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCourseDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courseDetails = action.payload;
            })
            .addCase(fetchCourseDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { resetPortalState } = studentPortalSlice.actions;
export default studentPortalSlice.reducer;
