import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  // Берём id из URL
  const { id } = useParams<{ id: string }>();
  // Достаём все ингредиенты из стора
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  // Ищем ингредиент по _id
  const ingredientData = ingredients.find((item) => item._id === id);

  // Если ингредиент не найден — показываем прелоадер
  if (!ingredientData) {
    return <Preloader />;
  }

  // Рендерим UI с данными ингредиента
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
