// components/ProtectedRoute.tsx
import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../services/store';

interface ProtectedRouteProps {
  children: React.ReactElement;
  onlyUnAuth?: boolean; // режим "только для неавторизованных"
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const { user, isAuthChecked, loading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  // Пока проверяем авторизацию — показываем лоадер
  if (!isAuthChecked && loading) return <div>Loading...</div>;

  const isLoggedIn = !!user;

  // 🔒 Если неавторизован — редирект на /login
  if (!onlyUnAuth && !isLoggedIn) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  // 🔓 Если уже авторизован, но страница только для гостей — редирект на главную
  if (onlyUnAuth && isLoggedIn) {
    const from = (location.state as any)?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  // ✅ Иначе — рендерим дочерний элемент
  return children;
};
