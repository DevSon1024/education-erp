import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/master/';
axios.defaults.withCredentials = true;

// --- Thunks ---
export const fetchCourses = createAsyncThunk('master/fetchCourses', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'course');
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createCourse = createAsyncThunk('master/createCourse', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'course', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const fetchBatches = createAsyncThunk('master/fetchBatches', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'batch');
        
        // DEBUG LOG: Open your browser console (F12) to see this
        console.log("API BATCH RESPONSE:", response.data); 

        // Ensure it returns an array
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) { 
        console.error("API BATCH ERROR:", error);
        return thunkAPI.rejectWithValue(error.message); 
    }
});

export const createBatch = createAsyncThunk('master/createBatch', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'batch', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

const masterSlice = createSlice({
    name: 'master',
    initialState: {
        courses: [],
        batches: [],
        isLoading: false,
        isSuccess: false,
        message: ''
    },
    reducers: {
        resetMasterStatus: (state) => {
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Courses
            .addCase(fetchCourses.fulfilled, (state, action) => { state.courses = action.payload; })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.courses.push(action.payload);
                state.isSuccess = true;
                state.message = 'Course Added';
            })
            // Batches
            .addCase(fetchBatches.fulfilled, (state, action) => { 
                state.batches = action.payload; 
            })
            .addCase(createBatch.fulfilled, (state, action) => {
                state.batches.push(action.payload);
                state.isSuccess = true;
                state.message = 'Batch Added';
            });
    }
});

export const { resetMasterStatus } = masterSlice.actions;
export default masterSlice.reducer;