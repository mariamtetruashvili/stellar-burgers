import { FC } from 'react';
import { useAppSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

// Фильтруем заказы по статусу и возвращаем первые 20 номеров
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useAppSelector((state) => state.feed.data?.orders || []);

  const total = useAppSelector((state) => state.feed.data?.total || 0);

  const totalToday = useAppSelector(
    (state) => state.feed.data?.totalToday || 0
  );

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  const feed = {
    total,
    totalToday
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
