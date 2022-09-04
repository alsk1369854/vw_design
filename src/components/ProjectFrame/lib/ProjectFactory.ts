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
            strIconSrc: (strIconSrc) ? strIconSrc : 'data:image/png;base64, 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',
            // strIconSrc: (strIconSrc) ? strIconSrc : 'https://picsum.photos/50/50',
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