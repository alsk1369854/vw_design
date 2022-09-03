import { nanoid } from "nanoid"
import { IProjectContents } from "./ProjectInterfaceCollection"
import ProjectManager from "./ProjectManager"

export interface INewProjectValues {
    strProjectName: string,
    strIconSrc?: string,
    strOwner: string,
}

export default class ProjectFactory {
    static getNewProject = (objNewProjectValues: INewProjectValues) => {
        const { strProjectName, strIconSrc, strOwner } = objNewProjectValues
        const projectID = nanoid()
        const projectInfo: IProjectContents = {
            strId: projectID,
            strName: strProjectName,
            strType: 'vw_project',
            strIconSrc: (strIconSrc) ? strIconSrc : 'https://picsum.photos/50/50',
            strOwner: strOwner,
            strLastEditTime: ProjectManager.getNowDateTimeToString(),
            objRootFile: {
                strId: projectID,
                boolIsDirectory: true,
                strFileName: 'root',
                strData: "",
                strDataType: "directory",
                boolIsExpand: true,
                arrFileSubFiles: [
                    {
                        "strId": nanoid(),
                        "boolIsDirectory": false,
                        "strFileName": "index.html",
                        "strData": "<!DOCTYPE html><html lang=\"en\"><head></head><body><h1>Hello World!</h1></body><script src=\"\"></script></html>",
                        "strDataType": "text",
                        "boolIsExpand": false,
                        "arrFileSubFiles": []
                    },
                ]
            }
        }
        return projectInfo
    }
}