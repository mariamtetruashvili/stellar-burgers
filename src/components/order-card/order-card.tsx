import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useAppSelector } from '../../services/store';

const maxIngredients = 6; // Максимум ингредиентов для отображения

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  // Берём все ингредиенты из стора
  const ingredients: TIngredient[] = useAppSelector(
    (state) => state.ingredients.ingredients
  );

  // Формируем данные заказа
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    // Собираем список ингредиентов по ID
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // Считаем общую стоимость заказа
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Оставляем только первые maxIngredients ингредиентов
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Считаем, сколько ингредиентов скрыто
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    // Дата оформления
    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  // Если ингредиенты ещё не загрузились
  if (!orderInfo) return null;

  // Рендерим карточку заказа
  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
