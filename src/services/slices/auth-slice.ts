import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData,
  TUserResponse
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

type User = { email: string; name: string };

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthChecked: false
};

// --- Thunks --- //

export const fetchUser = createAsyncThunk<User>(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const data: TUserResponse = await getUserApi();
      return data.user;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Не удалось получить пользователя');
    }
  }
);

export const loginThunk = createAsyncThunk<User, TLoginData>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginUserApi(payload);
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Ошибка входа');
    }
  }
);

export const registerThunk = createAsyncThunk<User, TRegisterData>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await registerUserApi(payload);
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Ошибка регистрации');
    }
  }
);

export const updateUserThunk = createAsyncThunk<User, Partial<TRegisterData>>(
  'auth/update',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateUserApi(payload);
      return data.user;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Ошибка обновления');
    }
  }
);

export const logoutThunk = createAsyncThunk<void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Ошибка выхода');
    }
  }
);

// --- Slice --- //
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthChecked = true;
      })

      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthChecked = true;
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  }
});

export const { setUser, setAuthChecked, clearError } = authSlice.actions;
export default authSlice.reducer;
