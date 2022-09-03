import { FileConstructor } from "../../FileManager/lib/File"

export interface IProjectContents {
    strId: string,
    strType: string,
    strName: string,
    strIconSrc: string,
    strOwner?: string,
    strLastEditTime: string,
    objRootFile: FileConstructor,
}

export interface IProjectState {
    fileHandle: FileSystemFileHandle | undefined,
    contents: IProjectContents | undefined
}

export interface IProjectNameCheck {
    state: boolean,
    message: string,
    newProjectName: string,
}
export const DATE_FORMAT = 'YYYY/MM/DD, HH:mm:ss'