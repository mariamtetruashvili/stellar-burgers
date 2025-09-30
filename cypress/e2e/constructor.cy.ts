import * as orderData from '../fixtures/order.json';
import * as authTokens from '../fixtures/token.json';

const API_URL = 'https://norma.nomoreparties.space/api';

describe('E2E тестирование страницы конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  context('Добавление и проверка ингредиентов в конструкторе', () => {
    it('Добавление ингредиентов в конструктор', () => {
      cy.wait('@getIngredients');

      cy.contains('Флюоресцентная булка R2-D3')
        .closest('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });

      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });

      cy.contains('Соус Spicy-X')
        .closest('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });

      cy.contains('Флюоресцентная булка R2-D3 (верх)').should('be.visible');
      cy.get('[data-cy=constructor-elements]').within(() => {
        cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
        cy.contains('Соус Spicy-X').should('be.visible');
      });
      cy.contains('Флюоресцентная булка R2-D3 (низ)').should('be.visible');
    });

    it('Проверка модального окна заказа', () => {
      cy.contains('Оформить заказ').click({ force: true });

      cy.intercept('POST', `${API_URL}/orders`, {
        statusCode: 200,
        body: { success: true, order: { number: 39638 } }
      }).as('postOrder');
    });
  });

  describe('Тестирование работы модального окна ингредиента', () => {
    it('Открытие модального окна', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('Закрытие модалки крестиком', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy=close_modal_btn]').click();
      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('Закрытие модалки кликом по оверлею', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy=modal_overlay]').click({ force: true });
      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('Закрытие модалки клавишей ESC', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('body').type('{esc}');
      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

  describe('Тестирование создания заказа', () => {
    beforeEach(() => {
      cy.intercept(`${API_URL}/ingredients`, {
        fixture: 'ingredients.json'
      }).as('getIngredients');
      cy.intercept(`${API_URL}/auth/user`, { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept(`${API_URL}/orders`, { fixture: 'order.json' }).as(
        'createOrder'
      );

      cy.setCookie(
        'accessToken',
        authTokens.accessToken.replace('Bearer ', '')
      );
      localStorage.setItem('refreshToken', authTokens.refreshToken);

      cy.visit('/');
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    it('Полный процесс создания заказа', () => {
      cy.contains('Флюоресцентная булка R2-D3')
        .closest('li')
        .within(() => cy.contains('Добавить').click());

      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .within(() => cy.contains('Добавить').click());

      cy.contains('Соус Spicy-X')
        .closest('li')
        .within(() => cy.contains('Добавить').click());

      cy.contains('Оформить заказ').should('not.be.disabled');

      cy.contains('Оформить заказ').click({ force: true });

      cy.wait('@createOrder');

      cy.get('[data-cy=modal]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy=modal]')
        .find('h2')
        .contains(orderData.order.number.toString());

      cy.get('[data-cy=close_modal_btn]').click();

      cy.url().should('eq', 'http://localhost:4000/');
    });

    it('Проверка ошибки создания заказа без ингредиентов', () => {
      cy.contains('Оформить заказ').should('be.disabled');

      cy.get('[data-cy=modal]').should('not.exist');
    });
  });
});
