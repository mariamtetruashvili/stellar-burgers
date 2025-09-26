import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

// ✅ Тип состояния ингредиентов
type TIngredientsState = {
  orderRequest: any; // Текущий заказ
  constructorItems: any; // Состав конструктора (булка + начинки)
  ingredients: TIngredient[]; // Список всех ингредиентов
  isLoading: boolean; // Статус загрузки
  error: string | null; // Ошибка
};

// ✅ Начальное состояние
const initialState: TIngredientsState = {
  ingredients: [],
  constructorItems: {
    bun: null, // Булка
    ingredients: [] // Начинки
  },
  isLoading: false,
  error: null,
  orderRequest: undefined
};

// ✅ Thunk: загрузка ингредиентов с сервера
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка при загрузке ингредиентов');
    }
  }
);

// ✅ Слайс ингредиентов
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // ✅ Добавить ингредиент в конструктор
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.constructorItems.bun = ingredient;
      } else {
        state.constructorItems.ingredients.push(ingredient);
      }
    },
    // ✅ Удалить ингредиент из конструктора
    removeIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item: { _id: string }) => item._id !== action.payload._id
        );
    },
    // ✅ Переместить ингредиент вверх
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index <= 0) return;
      const arr = state.constructorItems.ingredients;
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
    },
    // ✅ Переместить ингредиент вниз
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const arr = state.constructorItems.ingredients;
      if (index >= arr.length - 1) return;
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    },
    // ✅ Очистить конструктор
    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    // ✅ fetchIngredients pending
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    // ✅ fetchIngredients fulfilled
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ingredients = action.payload;
    });
    // ✅ fetchIngredients rejected
    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

// ✅ Экспорт редюсера
export default ingredientsSlice.reducer;

// ✅ Экспорт действий
export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = ingredientsSlice.actions;
