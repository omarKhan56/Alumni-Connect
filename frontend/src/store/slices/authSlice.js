import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import toast from 'react-hot-toast'

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials)
      localStorage.setItem('ac_token', data.token)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

// REGISTER (NO EMAIL VERIFICATION NOW)
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', userData)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

// LOAD USER
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/profile')
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load user')
    }
  }
)

// UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('ac_token'),
    loading: false,
    initialized: false,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('ac_token')
    },
    setUser(state, action) {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.initialized = true
        toast.success(`Welcome back, ${action.payload.user.name}!`)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.initialized = true
        toast.error(action.payload)
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        toast.success('Registration successful! You can now login.')
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        toast.error(action.payload)
      })

      // LOAD USER (IMPORTANT FIX)
      .addCase(loadUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.initialized = true
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false
        state.token = null
        state.user = null
        state.initialized = true
        localStorage.removeItem('ac_token')
      })

      // UPDATE PROFILE
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
        toast.success('Profile updated!')
      })
      .addCase(updateProfile.rejected, (_, action) => {
        toast.error(action.payload)
      })
  },
})

export const { logout, setUser } = authSlice.actions
export default authSlice.reducer