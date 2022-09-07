export enum IClipboardReadOptionType {
    RAW = 'raw',
    VW_DATA = 'vw_data', // default
}

export interface IClipboardReadOption {
    type?: IClipboardReadOptionType
}

export interface IClipboardVWData {
    id: string,
    data: object,
}

interface IClipboardVWDataPack {
    type: IClipboardReadOptionType,
    contents: IClipboardVWData
}

export default class ClipboardController {
    static read = async (option?: IClipboardReadOption): Promise<string | IClipboardVWData | undefined> => {
        const type = (option && option.type) ? option.type : IClipboardReadOptionType.VW_DATA
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (type === IClipboardReadOptionType.VW_DATA) {
                const objVWDataPack: IClipboardVWDataPack = JSON.parse(clipboardText)
                if (objVWDataPack.type === IClipboardReadOptionType.VW_DATA) {
                    return objVWDataPack.contents
                }
            } else if (type === IClipboardReadOptionType.RAW) {
                return clipboardText
            }
        } catch (error) {
            // debug
            // if(process.env.NODE_ENV === "development"){
            //     console.log('ClipboardController')
            //     console.error(error);
            // }
        }
    }

    static write = async (objVWData: IClipboardVWData) => {
        try {
            const objVWDataPack: IClipboardVWDataPack = {
                type: IClipboardReadOptionType.VW_DATA,
                contents: objVWData
            }
            await navigator.clipboard.writeText(JSON.stringify(objVWDataPack));

            // debug
            // if (process.env.NODE_ENV === "development") {
            //     console.log('ClipboardController Write')
            // }
        } catch (error) {
            console.error(error);
        }
    }

    static writeText = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);

            // debug
            // if (process.env.NODE_ENV === "development") {
            //     console.log('ClipboardController Write')
            // }
        } catch (error) {
            console.error(error);
        }
    }
}
