import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

type TIngredientsState = {
  orderRequest: any;
  constructorItems: any;
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  constructorItems: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  error: null,
  orderRequest: undefined
};

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

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.constructorItems.bun = ingredient;
      } else {
        state.constructorItems.ingredients.push(ingredient);
      }
    },

    removeIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item: { _id: string }) => item._id !== action.payload._id
        );
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index <= 0) return;
      const arr = state.constructorItems.ingredients;
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const arr = state.constructorItems.ingredients;
      if (index >= arr.length - 1) return;
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    },

    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ingredients = action.payload;
    });

    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export default ingredientsSlice.reducer;

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = ingredientsSlice.actions;
