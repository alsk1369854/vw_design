import React from 'react';

import fc from '.'

describe("Function Caller", () => {
    test('單次觸發', () => {
      const mockFunc = jest.fn();
  
        fc.set('testFunc', mockFunc);
        fc.call('testFunc')
      expect(mockFunc).toBeCalledTimes(1);
      fc.remove('testFunc')
    });

    test('連續測試', () => {
      const mockFunc = jest.fn();
  
        fc.set('testFunc', mockFunc);
        fc.call('testFunc')
        fc.call('testFunc')
        fc.call('testFunc')
        fc.call('testFunc')
        fc.call('testFunc')
        fc.call('testFunc')
      expect(mockFunc).toBeCalledTimes(6);
      fc.remove('testFunc')
    });

    test('交叉測試', () => {
      const mockFunc1 = jest.fn();
      const mockFunc2 = jest.fn();
      const mockFunc3 = jest.fn();
  
        fc.set('testFunc1', mockFunc1);
        fc.set('testFunc2', mockFunc2);
        fc.set('testFunc3', mockFunc3);

        fc.call('testFunc2')
        fc.call('testFunc3')
        fc.call('testFunc1')

      expect(mockFunc1).toBeCalledTimes(1);
      expect(mockFunc2).toBeCalledTimes(1);
      expect(mockFunc3).toBeCalledTimes(1);
      fc.remove('testFunc2')
      fc.remove('testFunc3')
      fc.remove('testFunc1')
    });

    test('多重交叉測試', () => {
      const mockFunc1 = jest.fn();
      const mockFunc2 = jest.fn();
      const mockFunc3 = jest.fn();
        fc.set('testFunc1', mockFunc1);
        fc.set('testFunc2', mockFunc2);
        fc.set('testFunc3', mockFunc3);

        fc.call('testFunc2')
        fc.call('testFunc3')
        fc.call('testFunc1')
        fc.call('testFunc3')
        fc.call('testFunc1')
        fc.call('testFunc2')
        fc.call('testFunc3')
        fc.call('testFunc3')        
        fc.call('testFunc2')
        fc.call('testFunc1')
        fc.call('testFunc3')
        fc.call('testFunc2')
        fc.call('testFunc2')

      expect(mockFunc1).toBeCalledTimes(3);
      expect(mockFunc2).toBeCalledTimes(5);
      expect(mockFunc3).toBeCalledTimes(5);
      fc.remove('testFunc2')
      fc.remove('testFunc3')
      fc.remove('testFunc1')
    });

    test('正序測試', () => {
      const mockFunc1 = jest.fn();
      const mockFunc2 = jest.fn();
      const mockFunc3 = jest.fn();
  
        fc.set('testFunc1', mockFunc1);
        fc.set('testFunc2', mockFunc2);
        fc.set('testFunc3', mockFunc3);

        
        fc.call('testFunc1')
        fc.call('testFunc2')
        fc.call('testFunc3')

      expect(mockFunc1).toBeCalledTimes(1);
      expect(mockFunc2).toBeCalledTimes(1);
      expect(mockFunc3).toBeCalledTimes(1);
      fc.remove('testFunc2')
      fc.remove('testFunc3')
      fc.remove('testFunc1')
    });

    test('倒序測試', () => {
      const mockFunc1 = jest.fn();
      const mockFunc2 = jest.fn();
      const mockFunc3 = jest.fn();
  
        fc.set('testFunc1', mockFunc1);
        fc.set('testFunc2', mockFunc2);
        fc.set('testFunc3', mockFunc3);

        fc.call('testFunc3')
        fc.call('testFunc2')
        fc.call('testFunc1')

      expect(mockFunc1).toBeCalledTimes(1);
      expect(mockFunc2).toBeCalledTimes(1);
      expect(mockFunc3).toBeCalledTimes(1);
      fc.remove('testFunc2')
      fc.remove('testFunc3')
      fc.remove('testFunc1')
    });

});
