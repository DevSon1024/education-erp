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

export const fetchBatches = createAsyncThunk('master/fetchBatches', async (params, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'batch', { params });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const fetchSubjects = createAsyncThunk('master/fetchSubjects', async (params, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'subject', { params });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createSubject = createAsyncThunk('master/createSubject', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'subject', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const fetchEmployees = createAsyncThunk('master/fetchEmployees', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'employee');
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createBatch = createAsyncThunk('master/createBatch', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'batch', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

// New: Fetch Exam Requests
export const fetchExamRequests = createAsyncThunk('master/fetchExamRequests', async (params, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'exam-request', { params });
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

// New: Cancel Exam Request
export const cancelExamRequest = createAsyncThunk('master/cancelExamRequest', async (id, thunkAPI) => {
    try {
        await axios.put(`${API_URL}exam-request/${id}/cancel`);
        return id;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

const masterSlice = createSlice({
    name: 'master',
    initialState: {
        courses: [],
        batches: [],
        employees: [],
        subjects: [],
        examRequests: [],
        studentsList: [],
        isLoading: false,
        isSuccess: false,
        message: ''
    },
    reducers: {
        resetMasterStatus: (state) => {
            state.isLoading = false;
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
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.employees = action.payload;
            })
            .addCase(fetchSubjects.pending, (state) => { state.isLoading = true; })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subjects = action.payload;
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.isLoading = false;
                console.error(action.payload);
            })
            .addCase(createSubject.pending, (state) => { state.isLoading = true; })
            .addCase(createSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Subject Created Successfully';
                // INSTANT UPDATE: Add to list immediately
                state.subjects.unshift(action.payload); 
            })
            .addCase(createSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
                state.isSuccess = false; // Ensure it fails gracefully
            })
            .addCase(createBatch.fulfilled, (state, action) => {
                state.batches.push(action.payload);
                state.isSuccess = true;
                state.message = 'Batch Added';
            })
            // Exam Request Cases
            .addCase(fetchExamRequests.pending, (state) => { state.isLoading = true; })
            .addCase(fetchExamRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examRequests = action.payload;
            })
            .addCase(cancelExamRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Exam Cancelled';
                state.examRequests = state.examRequests.filter(req => req._id !== action.payload);
            });
    }
});

export const { resetMasterStatus } = masterSlice.actions;
export default masterSlice.reducer;