import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/students/";
axios.defaults.withCredentials = true;

export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async (params, thunkAPI) => {
    try {
      // params can include { pageNumber: 1, keyword: '' }
      const response = await axios.get(API_URL, { params });

      console.log("API STUDENT RESPONSE:", response.data); // Browser Log

      // Return the whole object { students: [], page: 1, ... }
      return response.data;
    } catch (error) {
      console.error("Student Fetch Error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const toggleActiveStatus = createAsyncThunk(
  "students/toggleStatus",
  async (id, thunkAPI) => {
    try {
      await axios.put(`${API_URL}${id}/toggle`);
      return id; // Return ID to update local state
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
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    pagination: { page: 1, pages: 1, count: 0 },
    isLoading: false,
    isSuccess: false,
    message: "",
  },
  reducers: {
    resetStatus: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;

        // SAFETY CHECK: Ensure students array exists
        state.students = action.payload.students || [];

        state.pagination = {
          page: action.payload.page || 1,
          pages: action.payload.pages || 1,
          count: action.payload.count || 0,
        };
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.students = []; // Clear on error
        console.error("Redux Failed to Load Students:", action.payload);
      })
      .addCase(registerStudent.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Student Registered Successfully";
      })
      .addCase(toggleActiveStatus.fulfilled, (state, action) => {
        const student = state.students.find((s) => s._id === action.payload);
        if (student) student.isActive = !student.isActive;
      });
  },
});

export const { resetStatus } = studentSlice.actions;
export default studentSlice.reducer;