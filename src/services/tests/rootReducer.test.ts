import { rootReducer, RootState } from '../../services/rootReducer';
import ingredientsReducer from '../slices/ingredients-slice';
import authReducer from '../slices/auth-slice';

describe('rootReducer тесты', () => {
  it('должен иметь правильное начальное состояние для каждого слайса', () => {
    const initialState: RootState = rootReducer(undefined, { type: '' });

    expect(initialState.ingredients).toEqual(
      ingredientsReducer(undefined, { type: '' })
    );

    expect(initialState.auth).toEqual(authReducer(undefined, { type: '' }));
  });

  it('должен обновлять ingredients slice при dispatch', () => {
    const action = { type: 'ingredients/someAction' };
    const stateBefore = rootReducer(undefined, { type: '' });
    const newState = rootReducer(stateBefore, action);

    expect(newState.ingredients).toEqual(
      ingredientsReducer(stateBefore.ingredients, action)
    );
  });

  it('должен обновлять auth slice при dispatch', () => {
    const action = { type: 'auth/someAction' };
    const stateBefore = rootReducer(undefined, { type: '' });
    const newState = rootReducer(stateBefore, action);

    expect(newState.auth).toEqual(authReducer(stateBefore.auth, action));
  });
});
