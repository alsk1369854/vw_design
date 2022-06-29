## Function Caller
    /****** API *******/ 
    set('funcKey', myFunction)  // void
    call('funcKey')             // return function Return Value
    call('funcKey', [1,2])      // return function Return Value
    remove('funcKey')           // return function
    hasKey('keyName')           // return true/false 
    getKeys()                   // return ['key1', 'key2', ....]    
    getFunctions('funcKey')     // return function


    // 使用範例
    // 引入 function caller 
    import fc from '/src/tools/FunctionCaller'
    
    (1). 註冊函數:
        1). 制定要發布的方法
            const myFunction = ()=> console.log('myFunction');
        2). 註冊至 FunctionCaller, 依照 key by value 的方式
            fc.set('funcKey', myFunction);

    (2). 使用已註冊的函數:
        1). 無參數呼叫
            const returnValue = fc.call('funcKey'); 
        2). 傳參呼叫
            // 假設註冊 一個 sum Function
            fc.set('sumFn', (num1, num2)=> return num1 + num2);
            // 呼叫函數傳參方式
            const returnValue = fc.call('sumFn', [1,2]);

    (3). 刪除已註冊的函數
        1). 使用key註銷函數
            fc.remove('funcKey');

    (4). 查詢Key是否已註冊
        const keyExist = fc.hasKey('keyName');
        