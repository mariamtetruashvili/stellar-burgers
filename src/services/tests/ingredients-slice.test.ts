import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  fetchIngredients
} from '../slices/ingredients-slice';
import { TIngredient } from '../../utils/types';

describe('ingredientsSlice тесты', () => {
  const initialState = {
    ingredients: [],
    constructorItems: { bun: null, ingredients: [] },
    isLoading: false,
    error: null,
    orderRequest: undefined
  };

  const ingredient1: TIngredient = {
    _id: '1',
    name: 'Булочка',
    type: 'bun',
    price: 100,
    image: '',
    image_large: '',
    image_mobile: '',
    calories: 0,
    proteins: 0,
    fat: 0,
    carbohydrates: 0
  };
  const ingredient2: TIngredient = {
    _id: '2',
    name: 'Мясо',
    type: 'main',
    price: 200,
    image: '',
    image_large: '',
    image_mobile: '',
    calories: 0,
    proteins: 0,
    fat: 0,
    carbohydrates: 0
  };

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('добавление ингредиента типа bun', () => {
    const state = reducer(initialState, addIngredient(ingredient1));
    expect(state.constructorItems.bun).toEqual(ingredient1);
  });

  it('добавление ингредиента типа main', () => {
    const state = reducer(initialState, addIngredient(ingredient2));
    expect(state.constructorItems.ingredients).toContain(ingredient2);
  });

  it('удаление ингредиента', () => {
    const prevState = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ingredient2] }
    };
    const state = reducer(prevState, removeIngredient(ingredient2));
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('перемещение ингредиента вверх', () => {
    const prevState = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ingredient1, ingredient2] }
    };
    const state = reducer(prevState, moveIngredientUp(1));
    expect(state.constructorItems.ingredients[0]).toEqual(ingredient2);
    expect(state.constructorItems.ingredients[1]).toEqual(ingredient1);
  });

  it('перемещение ингредиента вниз', () => {
    const prevState = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ingredient1, ingredient2] }
    };
    const state = reducer(prevState, moveIngredientDown(0));
    expect(state.constructorItems.ingredients[0]).toEqual(ingredient2);
    expect(state.constructorItems.ingredients[1]).toEqual(ingredient1);
  });

  it('очистка конструктора', () => {
    const prevState = {
      ...initialState,
      constructorItems: { bun: ingredient1, ingredients: [ingredient2] }
    };
    const state = reducer(prevState, clearConstructor());
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [ingredient1, ingredient2]
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([ingredient1, ingredient2]);
  });

  it('fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка загрузки ингредиентов'
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
