import { nanoid } from "nanoid"
import File, { FileConstructor } from './File'

export default class FileFactory {
    static getNewFile = (boolIsDirectory: boolean) => {
        const FileConstructor: FileConstructor = {
            strId: nanoid(),
            boolIsDirectory: boolIsDirectory,
            strFileName: '',
            strData: '',
            strDataType: (boolIsDirectory) ? 'directory' : 'text',
            boolIsExpand: false,
            arrFileSubFiles: []
        }
        return new File(FileConstructor)
    }
}