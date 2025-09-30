import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientIds);
      return data.order;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

interface OrderState {
  currentOrder: TOrder | null;
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  orders: [],
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default orderSlice.reducer;
