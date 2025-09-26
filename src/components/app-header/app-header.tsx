import { FC } from 'react';
import { useAppSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

// Селектор: возвращает имя пользователя из состояния
const userNameSelector = (state: { auth: { user: { name: string } | null } }) =>
  state.auth.user?.name || '';

export const AppHeader: FC = () => {
  // Получаем имя пользователя из Redux
  const userName = useAppSelector(userNameSelector);

  // Передаём имя в UI-компонент шапки
  return <AppHeaderUI userName={userName} />;
};
