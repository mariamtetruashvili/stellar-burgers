import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients-slice';
import authReducer from './slices/auth-slice'; // ✅ Auth slice

// ✅ Корневой редюсер
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer, // ✅ Ингредиенты
  auth: authReducer // ✅ Авторизация/пользователь
});

// ✅ Тип состояния всего стора
export type RootState = ReturnType<typeof rootReducer>;
