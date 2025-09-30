import { expect, test, describe, jest } from '@jest/globals';
import * as Utils from '../../utils/cookie';

describe('Тесты утилит Cookie', () => {
  test('setCookie устанавливает cookie', () => {
    global.document = { cookie: '' } as any;
    const spy = jest.spyOn(Utils, 'setCookie');

    Utils.setCookie('test_name', 'test_val');

    expect(spy).toHaveBeenCalledWith('test_name', 'test_val');

    expect(document.cookie).toMatch(/test_name=test_val/);
  });

  test('getCookie возвращает правильное значение или undefined', () => {
    global.document = {
      cookie: 'test_name=test_val; another_cookie=123'
    } as any;
    const spy = jest.spyOn(Utils, 'getCookie');

    const val1 = Utils.getCookie('test_name');
    const val2 = Utils.getCookie('another_cookie');
    const val3 = Utils.getCookie('nonexistent');

    expect(spy).toHaveBeenCalledWith('test_name');
    expect(spy).toHaveBeenCalledWith('another_cookie');
    expect(spy).toHaveBeenCalledWith('nonexistent');
    expect(spy).toHaveBeenCalledTimes(3);

    expect(val1).toBe('test_val');
    expect(val2).toBe('123');
    expect(val3).toBeUndefined();
  });

  test('deleteCookie устанавливает cookie с истёкшей датой', () => {
    global.document = { cookie: '' } as any;
    const spy = jest.spyOn(Utils, 'deleteCookie');

    Utils.deleteCookie('test_name');

    expect(spy).toHaveBeenCalledWith('test_name');

    expect(document.cookie).toMatch(/test_name=/);
  });
});
