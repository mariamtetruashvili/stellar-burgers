import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../../services/slices/ingredients-slice';

// Элемент в конструкторе бургера (ингредиент в списке)
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    // Поднять ингредиент вверх
    const handleMoveUp = () => {
      dispatch(moveIngredientUp(index));
    };

    // Опустить ингредиент вниз
    const handleMoveDown = () => {
      dispatch(moveIngredientDown(index));
    };

    // Удалить ингредиент
    const handleClose = () => {
      dispatch(removeIngredient(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
