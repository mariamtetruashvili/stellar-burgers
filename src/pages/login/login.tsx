import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch } from '../../services/store';
import { loginThunk } from '../../services/slices/auth-slice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }))
      .unwrap()
      .then((userData) => {
        console.log('✅ Вход успешен, пользователь:', userData);
        navigate('/');
      })
      .catch((err) => {
        console.error('🚨 Ошибка входа:', err);
        setErrorText(err.message || 'Неверный email или пароль');
      });
  };

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
