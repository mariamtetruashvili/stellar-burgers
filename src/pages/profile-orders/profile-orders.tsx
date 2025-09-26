import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/order-slice';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  // ✅ Берём заказы из стора
  const orders: TOrder[] = useAppSelector((state) => state.order.orders);

  // ✅ Загружаем заказы при входе
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
