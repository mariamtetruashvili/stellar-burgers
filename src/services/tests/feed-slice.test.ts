import feedReducer, {
  clearCurrentOrder,
  fetchFeeds,
  getOrderByNumberThunk,
  TFeedState
} from '../slices/feed-slice';

// helper для тестирования async-thunk состояний
function testAsyncReducer(
  reducer: typeof feedReducer,
  initial: TFeedState,
  actionType: string,
  payload?: any
) {
  return reducer(initial, { type: actionType, payload });
}

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
      order: { /* заглушка заказа */ } as any
    };
    const nextState = feedReducer(prevState, clearCurrentOrder());
    expect(nextState.order).toBeNull();
  });

  it('fetchFeeds.pending устанавливает loading=true и error=null', () => {
    const state = testAsyncReducer(feedReducer, initialState, fetchFeeds.pending.type);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchFeeds.fulfilled сохраняет данные и сбрасывает loading', () => {
    const mockData = { orders: [], total: 5, totalToday: 2 };
    const state = testAsyncReducer(feedReducer, initialState, fetchFeeds.fulfilled.type, mockData);
    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockData);
  });

  it('fetchFeeds.rejected сохраняет ошибку и сбрасывает loading', () => {
    const errorMsg = 'Ошибка загрузки ленты';
    const state = testAsyncReducer(feedReducer, initialState, fetchFeeds.rejected.type, errorMsg);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  it('getOrderByNumberThunk.fulfilled сохраняет конкретный заказ', () => {
    const mockOrder = { id: '1' } as any;
    const state = testAsyncReducer(feedReducer, initialState, getOrderByNumberThunk.fulfilled.type, mockOrder);
    expect(state.loading).toBe(false);
    expect(state.order).toEqual(mockOrder);
  });
});
