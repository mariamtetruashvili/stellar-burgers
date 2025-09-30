import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feed-slice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

const ordersSelector = (state: {
  feed: { data: { orders: TOrder[] } | null };
}) => state.feed.data?.orders || [];

export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  const orders: TOrder[] = useAppSelector(ordersSelector);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
