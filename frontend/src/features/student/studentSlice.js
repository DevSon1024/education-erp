import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students/';
axios.defaults.withCredentials = true;

export const fetchStudents = createAsyncThunk('students/fetchAll', async (params, thunkAPI) => {
    try {
        // params can include pageNumber, keyword
        const response = await axios.get(API_URL, { params });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const registerStudent = createAsyncThunk('students/register', async (studentData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL, studentData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

const studentSlice = createSlice({
    name: 'students',
    initialState: {
        students: [],
        pagination: { page: 1, pages: 1, count: 0 },
        isLoading: false,
        isSuccess: false,
        message: ''
    },
    reducers: {
        resetStatus: (state) => {
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudents.pending, (state) => { state.isLoading = true; })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.students = action.payload.students;
                state.pagination = { 
                    page: action.payload.page, 
                    pages: action.payload.pages,
                    count: action.payload.count 
                };
            })
            .addCase(registerStudent.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Student Registered Successfully';
            });
    }
});

export const { resetStatus } = studentSlice.actions;
export default studentSlice.reducer;