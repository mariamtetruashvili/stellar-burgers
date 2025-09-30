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

  const testPending = (actionType: string) => {
    const state = reducer(initialState, { type: actionType });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  };

  const testRejected = (actionType: string, errorMsg: string) => {
    const state = reducer(initialState, {
      type: actionType,
      payload: errorMsg
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMsg);
  };

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  // createOrder
  it('обрабатывает createOrder.pending', () => {
    testPending(createOrder.pending.type);
  });

  it('обрабатывает createOrder.fulfilled', () => {
    const state = reducer(initialState, {
      type: createOrder.fulfilled.type,
      payload: order1
    });
    expect(state.loading).toBe(false);
    expect(state.currentOrder).toEqual(order1);
  });

  it('обрабатывает createOrder.rejected', () => {
    testRejected(createOrder.rejected.type, 'Ошибка создания заказа');
  });

  // fetchOrders
  it('обрабатывает fetchOrders.pending', () => {
    testPending(fetchOrders.pending.type);
  });

  it('обрабатывает fetchOrders.fulfilled', () => {
    const state = reducer(initialState, {
      type: fetchOrders.fulfilled.type,
      payload: [order1, order2]
    });
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual([order1, order2]);
  });

  it('обрабатывает fetchOrders.rejected', () => {
    testRejected(fetchOrders.rejected.type, 'Ошибка загрузки истории заказов');
  });
});
