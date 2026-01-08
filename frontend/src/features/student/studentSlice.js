import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/students/";
axios.defaults.withCredentials = true;

// Existing fetchStudents
export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async (params, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// New fetchStudentById
export const fetchStudentById = createAsyncThunk(
  "students/fetchOne",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleActiveStatus = createAsyncThunk(
  "students/toggleStatus",
  async (id, thunkAPI) => {
    try {
      await axios.put(`${API_URL}${id}/toggle`);
      return id; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const registerStudent = createAsyncThunk(
  "students/register",
  async (studentData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, studentData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    currentStudent: null, // For single view
    pagination: { page: 1, pages: 1, count: 0 },
    isLoading: false,
    isSuccess: false,
    message: "",
  },
  reducers: {
    resetStatus: (state) => {
      state.isSuccess = false;
      state.message = "";
      state.currentStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchStudents.pending, (state) => { state.isLoading = true; })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload.students || [];
        state.pagination = {
          page: action.payload.page || 1,
          pages: action.payload.pages || 1,
          count: action.payload.count || 0,
        };
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.students = [];
      })
      // Fetch One
      .addCase(fetchStudentById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStudent = action.payload;
      })
      // Register
      .addCase(registerStudent.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Student Registered Successfully";
      })
      // Toggle
      .addCase(toggleActiveStatus.fulfilled, (state, action) => {
        const student = state.students.find((s) => s._id === action.payload);
        if (student) student.isActive = !student.isActive;
      });
  },
});

export const { resetStatus } = studentSlice.actions;
export default studentSlice.reducer;