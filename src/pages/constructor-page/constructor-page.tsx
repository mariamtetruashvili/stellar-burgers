import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';

import styles from './constructor-page.module.css';
import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

const isIngredientsLoadingSelector = (state: {
  ingredients: { isLoading: boolean };
}) => state.ingredients.isLoading;

export const ConstructorPage: FC = () => {
  const dispatch = useAppDispatch();
  const isIngredientsLoading = useAppSelector(isIngredientsLoadingSelector);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            {/* Список ингредиентов */}
            <BurgerIngredients />
            {/* Конструктор бургера */}
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
