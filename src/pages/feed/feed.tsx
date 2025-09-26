import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feed-slice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

// ✅ Селектор: получаем список заказов из стейта
const ordersSelector = (state: {
  feed: { data: { orders: TOrder[] } | null };
}) => state.feed.data?.orders || [];

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  // ✅ Достаём заказы из стора
  const orders: TOrder[] = useAppSelector(ordersSelector);

  useEffect(() => {
    // ✅ Загружаем заказы при монтировании
    dispatch(fetchFeeds());
  }, [dispatch]);

  // ✅ Пока нет заказов — показываем прелоадер
  if (!orders.length) {
    return <Preloader />;
  }

  // ✅ Передаём заказы в UI-компонент
  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
