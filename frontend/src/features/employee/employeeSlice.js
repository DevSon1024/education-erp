import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees/';
axios.defaults.withCredentials = true;

export const fetchEmployees = createAsyncThunk('employees/fetchAll', async (filters, thunkAPI) => {
    try {
        const response = await axios.get(API_URL, { params: filters });
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createEmployee = createAsyncThunk('employees/create', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) { 
        // Capture the specific error message from backend
        const message = (error.response && error.response.data && error.response.data.message) || error.message;
        return thunkAPI.rejectWithValue(message); 
    }
});

const employeeSlice = createSlice({
    name: 'employees',
    initialState: {
        employees: [],
        isLoading: false,
        isSuccess: false,
        message: ''
    },
    reducers: {
        resetEmployeeStatus: (state) => {
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.employees = action.payload;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.employees.unshift(action.payload);
                state.isSuccess = true;
                state.message = 'Employee Added Successfully';
            });
    }
});

export const { resetEmployeeStatus } = employeeSlice.actions;
export default employeeSlice.reducer;