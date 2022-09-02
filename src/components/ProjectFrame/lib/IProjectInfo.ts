import { FileConstructor } from "../../FileManager/lib/File"

export interface IProjectInfo {
    strId: string,
    strType: string,
    strName: string,
    strIconSrc: string,
    strOwner?: string,
    strLastEditTime: string,
    objRootFile: FileConstructor,
}
export interface IProjectNameCheck {
    state: boolean,
    message: string,
    newProjectName: string,
}
export const DATE_FORMAT = 'YYYY/MM/DD, HH:mm:ss'