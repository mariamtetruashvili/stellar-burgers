import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient } from '../../services/slices/ingredients-slice';

// Карточка ингредиента в списке
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    // Добавить ингредиент в конструктор
    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }} // сохраняем маршрут для модалки
        handleAdd={handleAdd}
      />
    );
  }
);
