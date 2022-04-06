export class Test {
    public static getMockFunctions(intLength: number): Array<Function> {
        let arrFunction = [];
        for (let intTime = 0; intTime < intLength; intTime++){
            arrFunction.push(jest.fn());
        }
        return arrFunction;
    }

    public static setTestId(strTestId: string): string | undefined {
        return Test.isTestState() ? Test.clearSpace(strTestId) : undefined;
    }

    static isTestState(): boolean {
        return process.env.NODE_ENV === "test";
    }

    static clearSpace(string: string): string {
        return string.replace(/\s+/g, "")
    }
}


export abstract class abstractTestable {
    protected strName: string;
    protected strType: string;


    constructor(strName: string, strType: string){
        this.strName = strName;
        this.strType = strType;
    }

    getName(): string {
        return this.strName;
    }
    setName(strNewName: string): void {
        this.strName = strNewName;
    }

    getNameFilterSpaces(): string {
        return Test.clearSpace(this.strName);
    }

    getTestId(): string {
        return Test.clearSpace(this.strType + "_" + this.strName);
    }
    setTestId(): string | undefined {
        return Test.setTestId(this.strType + "_" + this.strName);
    }
}