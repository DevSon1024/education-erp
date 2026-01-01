import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transaction/';
axios.defaults.withCredentials = true;

// Fetch Inquiries
export const fetchInquiries = createAsyncThunk('transaction/fetchInquiries', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'inquiry');
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

// Create Inquiry
export const createInquiry = createAsyncThunk('transaction/createInquiry', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'inquiry', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

// Collect Fees
export const collectFees = createAsyncThunk('transaction/collectFees', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'fees', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        inquiries: [],
        receipts: [],
        isLoading: false,
        isSuccess: false,
        message: ''
    },
    reducers: {
        resetTransaction: (state) => {
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInquiries.fulfilled, (state, action) => { state.inquiries = action.payload; })
            .addCase(createInquiry.fulfilled, (state, action) => {
                state.inquiries.unshift(action.payload);
                state.isSuccess = true;
                state.message = 'Inquiry Added';
            })
            .addCase(collectFees.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.message = `Fee Receipt Generated: ${action.payload.receiptNo}`;
            });
    }
});

export const { resetTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;