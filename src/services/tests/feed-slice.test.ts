import feedReducer, {
  clearCurrentOrder,
  fetchFeeds,
  getOrderByNumberThunk,
  TFeedState
} from '../slices/feed-slice';

describe('feedSlice тесты', () => {
  const initialState: TFeedState = {
    data: null,
    order: null,
    loading: false,
    error: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(feedReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('очистка текущего заказа', () => {
    const prevState: TFeedState = {
      ...initialState,
      order: {
        /* заглушка заказа */
      } as any
    };
    const nextState = feedReducer(prevState, clearCurrentOrder());
    expect(nextState.order).toBeNull();
  });

  it('fetchFeeds.pending устанавливает loading=true и error=null', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchFeeds.fulfilled сохраняет данные и сбрасывает loading', () => {
    const mockData = { orders: [], total: 5, totalToday: 2 };
    const action = { type: fetchFeeds.fulfilled.type, payload: mockData };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockData);
  });

  it('fetchFeeds.rejected сохраняет ошибку и сбрасывает loading', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      payload: 'Ошибка загрузки ленты'
    };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ленты');
  });

  it('getOrderByNumberThunk.fulfilled сохраняет конкретный заказ', () => {
    const mockOrder = { id: '1' } as any;
    const action = {
      type: getOrderByNumberThunk.fulfilled.type,
      payload: mockOrder
    };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.order).toEqual(mockOrder);
  });
});
