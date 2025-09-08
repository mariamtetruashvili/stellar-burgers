import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { updateUserThunk } from '../../services/slices/auth-slice';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  // ✅ Получаем текущего пользователя и ошибку обновления
  const user = useAppSelector((state) => state.auth.user);
  const updateUserError = useAppSelector((state) => state.auth.error);

  // ✅ Локальный стейт формы
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  // ✅ Обновляем форму при изменении данных пользователя
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  // ✅ Проверяем, изменились ли поля формы
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  // ✅ Отправка формы обновления пользователя
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const payload: { name: string; email: string; password?: string } = {
      name: formValue.name,
      email: formValue.email
    };
    if (formValue.password) payload.password = formValue.password;

    dispatch(updateUserThunk(payload));
  };

  // ✅ Сброс формы к данным пользователя
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  // ✅ Обновление локального стейта при изменении input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  // ✅ Рендер UI-компонента профиля
  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
