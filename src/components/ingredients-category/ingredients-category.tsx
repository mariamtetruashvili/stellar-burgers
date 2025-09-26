import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useAppSelector } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Берём текущие данные конструктора из стора
  const burgerConstructor = useAppSelector(
    (state) => state.ingredients.constructorItems
  );

  // Считаем количество каждого ингредиента
  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};

    // Подсчёт начинок
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Булка всегда считается как 2 (верх и низ)
    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [burgerConstructor]);

  // Рендерим UI категории ингредиентов
  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
