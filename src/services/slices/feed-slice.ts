import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export interface TFeedState {
  data: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  } | null;
  order: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: TFeedState = {
  data: null,
  order: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const data = await getFeedsApi();
  return data;
});

export const getOrderByNumberThunk = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      if (data.success && data.orders.length > 0) {
        return data.orders[0];
      } else {
        return rejectWithValue('Заказ не найден');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка при загрузке заказа');
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchFeeds
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
      })

      // getOrderByNumberThunk
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

export const { clearCurrentOrder } = feedSlice.actions;

export default feedSlice.reducer;

export const orderSelector = (state: { feed: TFeedState }) => state.feed.order;
export const feedsDataSelector = (state: { feed: TFeedState }) =>
  state.feed.data;
export const feedsLoadingSelector = (state: { feed: TFeedState }) =>
  state.feed.loading;
export const feedsErrorSelector = (state: { feed: TFeedState }) =>
  state.feed.error;
