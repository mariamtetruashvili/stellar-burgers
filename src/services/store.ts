import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients-slice'; // ✅ Ингредиенты
import authReducer from './slices/auth-slice'; // ✅ Авторизация
import feedReducer from './slices/feed-slice'; // ✅ Лента заказов
import orderReducer from './slices/order-slice'; // ✅ История заказов
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// ✅ Корневой редюсер
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  feed: feedReducer,
  order: orderReducer
});

// ✅ Настройка стора
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// ✅ Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Кастомные хуки для использования в компонентах
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
