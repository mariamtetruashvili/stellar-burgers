import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

// Словарь статусов → текстовое отображение
const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  // Цвет текста в зависимости от статуса
  let textStyle = '';
  switch (status) {
    case 'pending':
      textStyle = '#E52B1A'; // красный
      break;
    case 'done':
      textStyle = '#00CCCC'; // бирюзовый
      break;
    default:
      textStyle = '#F2F2F3'; // серый (для created и прочих)
  }

  // Рендерим UI-компонент статуса заказа
  return <OrderStatusUI textStyle={textStyle} text={statusText[status]} />;
};
