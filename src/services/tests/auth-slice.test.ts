import authReducer, {
  setUser,
  setAuthChecked,
  clearError,
  fetchUser
} from '../slices/auth-slice';

interface User {
  email: string;
  name: string;
}

describe('Тесты auth slice', () => {
  const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthChecked: false
  };

  const mockUser: User = { email: 'test@example.com', name: 'Test User' };

  test('Возвращает начальное состояние', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('Обрабатывает setUser', () => {
    const state = authReducer(initialState, setUser(mockUser));

    expect(state.user).toEqual(mockUser);
  });

  test('Обрабатывает setAuthChecked(true)', () => {
    const state = authReducer(initialState, setAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  test('Обрабатывает setAuthChecked(false)', () => {
    const state = authReducer(
      { ...initialState, isAuthChecked: true },
      setAuthChecked(false)
    );
    expect(state.isAuthChecked).toBe(false);
  });

  test('Обрабатывает clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const state = authReducer(stateWithError, clearError());

    expect(state.error).toBeNull();
  });

  // --- ExtraReducers: pending, fulfilled, rejected ---
  test('Обрабатывает fetchUser.pending', () => {
    const action = { type: fetchUser.pending.type };
    const state = authReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Обрабатывает fetchUser.fulfilled', () => {
    const action = { type: fetchUser.fulfilled.type, payload: mockUser };
    const state = authReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  test('Обрабатывает fetchUser.rejected', () => {
    const action = { type: fetchUser.rejected.type, payload: 'Failed' };
    const state = authReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed');
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });
});
