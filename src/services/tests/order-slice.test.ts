import reducer, { createOrder, fetchOrders } from '../slices/order-slice';
import { TOrder } from '../../utils/types';

describe('orderSlice тесты', () => {
  const initialState = {
    currentOrder: null,
    orders: [],
    loading: false,
    error: null
  };

  const order1: TOrder = {
    _id: '1',
    ingredients: [],
    status: 'done',
    name: 'Заказ 1',
    number: 1,
    createdAt: '',
    updatedAt: ''
  };
  const order2: TOrder = {
    _id: '2',
    ingredients: [],
    status: 'pending',
    name: 'Заказ 2',
    number: 2,
    createdAt: '',
    updatedAt: ''
  };

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  // createOrder
  it('обрабатывает createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает createOrder.fulfilled', () => {
    const action = { type: createOrder.fulfilled.type, payload: order1 };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.currentOrder).toEqual(order1);
  });

  it('обрабатывает createOrder.rejected', () => {
    const action = {
      type: createOrder.rejected.type,
      payload: 'Ошибка создания заказа'
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка создания заказа');
  });

  // fetchOrders
  it('обрабатывает fetchOrders.pending', () => {
    const action = { type: fetchOrders.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fetchOrders.fulfilled', () => {
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: [order1, order2]
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual([order1, order2]);
  });

  it('обрабатывает fetchOrders.rejected', () => {
    const action = {
      type: fetchOrders.rejected.type,
      payload: 'Ошибка загрузки истории заказов'
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки истории заказов');
  });
});
