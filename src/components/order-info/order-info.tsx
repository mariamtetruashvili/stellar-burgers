import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  getOrderByNumberThunk,
  orderSelector
} from '../../services/slices/feed-slice';

export const OrderInfo: FC = () => {
  const dispatch = useAppDispatch();
  const { number } = useParams<{ number: string }>(); // Получаем номер заказа из URL

  // Загружаем заказ по номеру при монтировании
  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumberThunk(Number(number)));
    }
  }, [dispatch, number]);

  // Берём заказ и ингредиенты из стора
  const orderData = useAppSelector(orderSelector);
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  // Подготавливаем данные для UI
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    // Дата создания заказа
    const date = new Date(orderData.createdAt);

    // Счётчики для ингредиентов
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Собираем ингредиенты с количеством
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    // Считаем итоговую цену заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Если данные ещё не загрузились — показываем прелоадер
  if (!orderInfo) {
    return <Preloader />;
  }

  // Рендерим UI заказа
  return <OrderInfoUI orderInfo={orderInfo} />;
};
