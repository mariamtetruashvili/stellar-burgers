import { expect, test, describe, jest, afterAll } from '@jest/globals';
import * as API from '../../utils/burger-api';

// Функция для имитации ответа fetch
async function getMockResponse(data: any, ok: boolean = true) {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(data)
  });
}

// Сохраняем оригинальный fetch
const originalFetch = global.fetch;
afterAll(() => {
  global.fetch = originalFetch;
});

// ===================
// Константы и хелперы
// ===================
const mockData = {
  success: true,
  data: 'test data',
  orders: ['test1', 'test2'],
  user: { email: 'test@mail.com', name: 'Test User' },
  order: { number: 123 }
};

const mockError = {
  success: false,
  name: 'error',
  message: 'jwt expired'
};

const setFetchSuccess = () =>
  (global.fetch = jest.fn(() => getMockResponse(mockData)) as any);

const setFetchError = () =>
  (global.fetch = jest.fn(() => getMockResponse(mockError)) as any);

const expectError = (err: any) => expect(err).toEqual(mockError);

describe('Тесты Burger API', () => {
  // Мокируем document и localStorage
  global.document = { cookie: 'accessToken=test_val' } as any;
  global.localStorage = { getItem: () => 'testItem', setItem: () => {} } as any;

  test('getUserApi успешный запрос', async () => {
    setFetchSuccess();
    const spy = jest.spyOn(API, 'getUserApi');
    const res = await API.getUserApi();

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('logoutApi успешный запрос', async () => {
    setFetchSuccess();
    const spy = jest.spyOn(API, 'logoutApi');
    const res = await API.logoutApi();

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('updateUserApi успешный запрос', async () => {
    setFetchSuccess();
    const mockUserData = { name: 'Test', email: 'test@mail.com' };
    const spy = jest.spyOn(API, 'updateUserApi');
    const res = await API.updateUserApi(mockUserData);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('resetPasswordApi успешный запрос', async () => {
    setFetchSuccess();
    const mockUserData = { password: 'test', token: 'testtoken' };
    const spy = jest.spyOn(API, 'resetPasswordApi');
    const res = await API.resetPasswordApi(mockUserData);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('resetPasswordApi неуспешный запрос', async () => {
    setFetchError();
    const mockUserData = { password: 'test', token: 'testtoken' };
    await API.resetPasswordApi(mockUserData).catch(expectError);
  });

  test('forgotPasswordApi успешный запрос', async () => {
    setFetchSuccess();
    const mockUserData = { email: 'test@mail.com' };
    const spy = jest.spyOn(API, 'forgotPasswordApi');
    const res = await API.forgotPasswordApi(mockUserData);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('forgotPasswordApi неуспешный запрос', async () => {
    setFetchError();
    await API.forgotPasswordApi({ email: 'test@mail.com' }).catch(expectError);
  });

  test('loginUserApi успешный запрос', async () => {
    setFetchSuccess();
    const mockUserData = { email: 'test@mail.com', password: 'test' };
    const spy = jest.spyOn(API, 'loginUserApi');
    const res = await API.loginUserApi(mockUserData);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('loginUserApi неуспешный запрос', async () => {
    setFetchError();
    const mockUserData = { email: 'test@mail.com', password: 'test' };
    await API.loginUserApi(mockUserData).catch(expectError);
  });

  test('registerUserApi успешный запрос', async () => {
    setFetchSuccess();
    const mockUserData = {
      name: 'Test',
      email: 'test@mail.com',
      password: '123'
    };
    const spy = jest.spyOn(API, 'registerUserApi');
    const res = await API.registerUserApi(mockUserData);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('registerUserApi неуспешный запрос', async () => {
    setFetchError();
    const mockUserData = {
      name: 'Test',
      email: 'test@mail.com',
      password: '123'
    };
    await API.registerUserApi(mockUserData).catch(expectError);
  });

  test('getOrderByNumberApi успешный запрос', async () => {
    setFetchSuccess();
    const spy = jest.spyOn(API, 'getOrderByNumberApi');
    const res = await API.getOrderByNumberApi(123);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('orderBurgerApi успешный запрос', async () => {
    setFetchSuccess();
    const burger = ['id1', 'id2', 'id3'];
    const spy = jest.spyOn(API, 'orderBurgerApi');
    const res = await API.orderBurgerApi(burger);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('orderBurgerApi неуспешный запрос', async () => {
    setFetchError();
    const burger = ['id1', 'id2', 'id3'];
    await API.orderBurgerApi(burger).catch(expectError);
  });

  test('getOrdersApi успешный запрос', async () => {
    setFetchSuccess();
    const spy = jest.spyOn(API, 'getOrdersApi');
    const res = await API.getOrdersApi();

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData.orders);
  });

  test('getOrdersApi неуспешный запрос', async () => {
    setFetchError();
    await API.getOrdersApi().catch(expectError);
  });

  test('getFeedsApi успешный запрос', async () => {
    setFetchSuccess();
    const spy = jest.spyOn(API, 'getFeedsApi');
    const res = await API.getFeedsApi();

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('getFeedsApi неуспешный запрос', async () => {
    setFetchError();
    await API.getFeedsApi().catch(expectError);
  });

  test('getIngredientsApi успешный запрос', async () => {
    setFetchSuccess();
    const spy = jest.spyOn(API, 'getIngredientsApi');
    const res = await API.getIngredientsApi();

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData.data);
  });

  test('getIngredientsApi неуспешный запрос', async () => {
    setFetchError();
    await API.getIngredientsApi().catch(expectError);
  });

  test('refreshToken успешный запрос', async () => {
    setFetchSuccess();
    const spy = jest.spyOn(API, 'refreshToken');
    const res = await API.refreshToken();

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  test('refreshToken неуспешный запрос', async () => {
    setFetchError();
    await API.refreshToken().catch(expectError);
  });

  test('refreshToken неуспешный запрос с ok=false', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockError, false)) as any;
    await API.refreshToken().catch(expectError);
  });
});
