import { FileConstructor } from "../../FileManager/lib/File"

export interface IProjectInfo {
    id: string,
    type: string,
    name: string,
    iconSrc?: string,
    owner?: string,
    lastEditTime: string,
    rootFile: FileConstructor,
}
export interface IProjectNameCheck {
    state: boolean,
    message: string,
    newProjectName: string,
}
export const DATE_FORMAT = 'YYYY/MM/DD, HH:mm:ss'