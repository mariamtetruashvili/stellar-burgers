import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { registerThunk, clearError } from '../../services/slices/auth-slice';

export const Register: FC = () => {
  const dispatch = useAppDispatch();
  // ✅ Ошибка регистрации из стора
  const error = useAppSelector((state) => state.auth.error);

  // ✅ Локальный стейт формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

  // ✅ Отправка формы регистрации
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerThunk({
        name: userName,
        email,
        password
      })
    );
  };

  // ✅ Очистка ошибки при монтировании
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // ✅ Рендер UI-компонента регистрации
  return (
    <RegisterUI
      errorText={error || undefined}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail} // ✅ Обновление стейта
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
