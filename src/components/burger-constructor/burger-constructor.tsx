import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { createOrder } from '../../services/slices/order-slice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Данные конструктора из Redux
  const constructorItems = useAppSelector(
    (state) => state.ingredients.constructorItems
  );
  const orderRequest = useAppSelector((state) => state.order.loading);
  const orderModalData = useAppSelector((state) => state.order.currentOrder);

  // Авторизация
  const isAuthChecked = useAppSelector((state) => state.auth.isAuthChecked);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = !!user && isAuthChecked;

  // Подсчёт итоговой цены
  const price = useMemo(() => {
    if (!constructorItems.bun) return 0;
    return (
      constructorItems.bun.price * 2 +
      constructorItems.ingredients.reduce(
        (acc: number, item: TConstructorIngredient) => acc + item.price,
        0
      )
    );
  }, [constructorItems]);

  // Клик по кнопке "Оформить заказ"
  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login'); // если не авторизован → на страницу входа
    }

    const { bun, ingredients } = constructorItems;
    if (!bun || ingredients.length === 0 || orderRequest) return;

    // Формируем массив ID ингредиентов
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item: { _id: string }) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  // Закрытие модального окна заказа
  const closeOrderModal = () => {
    navigate('/', { replace: true });
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
