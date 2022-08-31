export default interface ProjectInfo{
    id: string,
    name: string,
    iconSrc?: string,
    owner?: string,
    lastEditTime? : string
}
export interface ProjectNameCheck{
    state: boolean,
    message: string,
    newProjectName: string,
}
export const DATE_FORMAT = 'YYYY/MM/DD, HH:mm:ss'