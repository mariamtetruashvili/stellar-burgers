import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

// ✅ Тип состояния фида
type TFeedState = {
  data: {
    orders: TOrder[]; // Список заказов
    total: number; // Всего заказов
    totalToday: number; // Всего сегодня
  } | null;
  order: TOrder | null; // Текущий заказ
  loading: boolean; // Загрузка
  error: string | null; // Ошибка
};

// ✅ Начальное состояние
const initialState: TFeedState = {
  data: null,
  order: null,
  loading: false,
  error: null
};

// ✅ Thunk: получить все заказы (лента)
export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const data = await getFeedsApi(); // публичный эндпоинт
  return data;
});

// ✅ Thunk: получить заказ по номеру
export const getOrderByNumberThunk = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      if (data.success && data.orders.length > 0) {
        return data.orders[0]; // ✅ первый заказ
      } else {
        return rejectWithValue('Заказ не найден');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка при загрузке заказа');
    }
  }
);

// ✅ Слайс
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // ✅ Очистить текущий заказ
    clearCurrentOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    // ✅ fetchFeeds
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ✅ getOrderByNumberThunk
    builder
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// ✅ Экспорт редюсера
export default feedSlice.reducer;

// ✅ Селекторы
export const orderSelector = (state: { feed: TFeedState }) => state.feed.order;
export const feedsDataSelector = (state: { feed: TFeedState }) =>
  state.feed.data;
export const feedsLoadingSelector = (state: { feed: TFeedState }) =>
  state.feed.loading;
export const feedsErrorSelector = (state: { feed: TFeedState }) =>
  state.feed.error;
