import { nanoid } from 'nanoid';
import { UsageError } from '../Error';


export class Test {
    public static getMockFunctions(intLength: number): Array<Function> {
        let arrFunction = [];
        for (let intTime = 0; intTime < intLength; intTime++){
            arrFunction.push(jest.fn());
        }
        return arrFunction;
    }

    public static setTestId(strTestId: string): string | undefined {
        return Test.isTestState() ? strTestId : undefined;
    }

    public static isTestState(): boolean {
        return process.env.NODE_ENV === "test";
    }
}


export abstract class abstractTestable {
    private strUniqueTestId = nanoid();


    constructor(){}

    getTestId(): string {
        if (!Test.isTestState()) throw new UsageError("abstractTestable- can't get testId if state isn't test")
        return this.strUniqueTestId;
    }
    setTestId(): string | undefined {
        return Test.setTestId(this.strUniqueTestId);
    }
}