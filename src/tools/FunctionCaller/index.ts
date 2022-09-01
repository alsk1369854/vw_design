import { FunctionCallerError } from '../Error/index'

// Error message
const ERROR_KEY_EXISTS = 'FunctionCaller:Key is exists';
const ERROR_KEY_NO_EXISTS = 'FunctionCaller:Key is not exists';

/**
 * @description 函數互叫者，可專案任意地方使用 set() 添加要註冊的函數， 並在任何替方透過 call() 進行調用
 * @author alsk1369854@gmail.com
 * @version 1.0.0
 */
class FunctionCaller {
    'use strict': string;

    // 所有註冊函數的收集地
    private objFuncCollection: any = {};

    /**
     * @description 註冊函數器
     * @param strKey 註冊函數的key (typeof String) 
     * @param func 要註冊的函數 (typeopf Function)
     */
    set(strKey: string, func: Function): void {
        if (this.objFuncCollection[strKey] !== undefined) throw new FunctionCallerError(ERROR_KEY_EXISTS);
        this.objFuncCollection = { [strKey]: func, ...this.objFuncCollection };
    }

    /**
     * @description 函數互叫器
     * @param strKey 註冊函數的key (typeof String) 
     * @param arrData 註冊函數的傳參 (typeof Array<any>) 
     * @returns 註冊函數運行後的回傳值
     */
    call(strKey: string, ...arrData: any[]): any {
        // if (this.objFuncCollection[strKey] === undefined) throw new FunctionCallerError(ERROR_KEY_NO_EXISTS);
        if (this.objFuncCollection[strKey] === undefined) console.error(ERROR_KEY_NO_EXISTS+`\nKEY:'${strKey}'`);
        if (this.objFuncCollection[strKey] === undefined) return;
        const { [strKey]: func } = this.objFuncCollection;
        if (arrData === undefined) return func();
        return func(...arrData);
    }

    /**
     * @description 解除註冊器，將已註冊的函數下架，將Key空閒出來
     * @param strKey 註冊函數的key
     * @returns 註冊函數
     */
    remove(strKey: string): Function | void {
        // if (this.objFuncCollection[strKey] === undefined) throw new FunctionCallerError(ERROR_KEY_NO_EXISTS);
        if (this.objFuncCollection[strKey] === undefined) return;
        const func = this.objFuncCollection[strKey];
        delete this.objFuncCollection[strKey];
        return func;
    }

    /**
     * @description 檢查key是否已被使用
     * @param strKey 註冊函數的key
     * @returns true => key已被使用; false => key未被使用
     */
    hasKey(strKey: string): boolean {
        if (this.objFuncCollection[strKey] !== undefined) return true;
        return false;
    }

    /**
     * @description 取得當前所註冊的所有Key
     * @returns 當前所註冊的所有 Key name (typeof Array<string>)
     */
    getKeys(): string[] {
        return Object.keys(this.objFuncCollection);
    }

    /**
     * @description 用於獲取所註冊的函數實體
     * @param strKey 註冊函數的key
     * @returns 所註冊的函數實體 (typeof Function)
     */
    getFunctions(strKey: string): Function {
        return this.objFuncCollection[strKey];
    }
}

// 採用單例發布(只會需要一個FunctionCaller)
export default new FunctionCaller();
