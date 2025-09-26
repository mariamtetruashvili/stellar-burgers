import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch } from '../../services/store'; // ✅ Доступ к dispatch
import { loginThunk } from '../../services/slices/auth-slice'; // ✅ Thunk для логина
import { useNavigate } from 'react-router-dom'; // ✅ Для перенаправления

export const Login: FC = () => {
  // ✅ Локальный стейт для формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState(''); // ✅ Текст ошибки

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ✅ Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }))
      .unwrap()
      .then((userData) => {
        console.log('✅ Вход успешен, пользователь:', userData);
        navigate('/'); // ✅ Перенаправление на главную
      })
      .catch((err) => {
        console.error('🚨 Ошибка входа:', err);
        setErrorText(err.message || 'Неверный email или пароль'); // ✅ Показываем ошибку
      });
  };

  // ✅ Рендерим UI-компонент формы
  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
