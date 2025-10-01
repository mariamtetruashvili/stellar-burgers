import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { registerThunk, clearError } from '../../services/slices/auth-slice';

export const Register: FC = () => {
  const dispatch = useAppDispatch();

  const error = useAppSelector((state) => state.auth.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

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

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <RegisterUI
      errorText={error || undefined}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
