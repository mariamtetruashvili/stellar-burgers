import { useEffect, useState, useRef, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAppSelector } from '../../services/store';
import { RootState } from '../../services/rootReducer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

// Секция со списком ингредиентов (булки, начинки, соусы)
export const BurgerIngredients: FC = () => {
  const { ingredients } = useAppSelector(
    (state: RootState) => state.ingredients
  );

  // Разделяем ингредиенты по категориям
  const buns = ingredients.filter((item) => item.type === 'bun');
  const mains = ingredients.filter((item) => item.type === 'main');
  const sauces = ingredients.filter((item) => item.type === 'sauce');

  // Текущая активная вкладка
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Рефы для заголовков категорий
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Наблюдение за видимостью секций
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Автоматически переключаем вкладку при скролле
  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewFilling) setCurrentTab('main');
    else if (inViewSauces) setCurrentTab('sauce');
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Клик по вкладке → скроллим к секции
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
