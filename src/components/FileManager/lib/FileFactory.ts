import { nanoid } from "nanoid"
import File, { FileConstructor } from './File'

export default class FileFactory {
    static getNewFile = (numFileType: number) => {
        const FileConstructor: FileConstructor = {
            strId: nanoid(),
            strFileName: '',
            numFileType: numFileType,
            strData: '',
            boolIsExpand: false,
        }
        return new File(FileConstructor)
    }
}