import Swal from 'sweetalert2'
import moment from 'moment'

import { ProjectManagerSaveEditingProjectError } from '../../../tools/Error/index'
import { IProjectContents, IProjectNameCheck, DATE_FORMAT, IProjectState } from './ProjectInterfaceCollection'
import FunctionCaller from '../../../tools/FunctionCaller'
import { FUNCTION_CALLER_KEY_TO_EDIT_PAGE } from '../index'
import { FUNCTION_CALLER_KEY_UPDATE_SHOW_PROJECT_LIST } from '../ProjectListFrame/index'
import FileManager from '../../FileManager/lib/FileManager'
import FileMangerFile, { FileConstructor } from '../../FileManager/lib/File';
import ProjectFactory, { INewProjectValues } from './ProjectFactory';


const regExpJsonExtension = /.json$/ig

export default class ProjectManager {
    static editingProjectState: IProjectState = {
        fileHandle: undefined,
        contents: undefined,
    }

    static projectHouseDirectoryHandle: FileSystemDirectoryHandle | null = null
    static showProjectStateList: IProjectState[] = []

    static getEditingProjectState = (): IProjectState => ProjectManager.editingProjectState
    static setEditingProjectState = (objNewEditingProjectState: IProjectState) => {
        ProjectManager.saveEditingProject()
        ProjectManager.editingProjectState = objNewEditingProjectState
        const { contents } = ProjectManager.editingProjectState
        if (contents) FileManager.setRootFile(contents.objRootFile)
    }

    static getProjectHouseDirectoryHandle = () => ProjectManager.projectHouseDirectoryHandle
    static setProjectHouseDirectoryHandle = (newProjectHouseDirectoryHandle: FileSystemDirectoryHandle | null) =>
        ProjectManager.projectHouseDirectoryHandle = newProjectHouseDirectoryHandle

    static getShowProjectStateList = (): IProjectState[] => ProjectManager.showProjectStateList
    static setShowProjectStateList = (arrNewShowProjectStateList: IProjectState[]) => {
        ProjectManager.showProjectStateList = arrNewShowProjectStateList
        FunctionCaller.call(FUNCTION_CALLER_KEY_UPDATE_SHOW_PROJECT_LIST, ProjectManager.showProjectStateList)
    }
    static addShowProjectStateList = (objProjectState: IProjectState) => {
        ProjectManager.getShowProjectStateList().push(objProjectState)
        FunctionCaller.call(FUNCTION_CALLER_KEY_UPDATE_SHOW_PROJECT_LIST, ProjectManager.showProjectStateList)
    }

    static createNewProject = () => {
        Swal.fire({
            title: 'New Project Name',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Create',
            showLoaderOnConfirm: true,
            preConfirm: (strProjectName) => {
                const objProjectNameCheck = ProjectManager.checkNewProjectName(strProjectName)
                const { state, message } = objProjectNameCheck
                if (state) return objProjectNameCheck
                Swal.showValidationMessage(message)
            },
        }).then((response) => {
            const { isConfirmed, value: objProjectNameCheck } = response
            if (isConfirmed) {
                const { newProjectName } = objProjectNameCheck as IProjectNameCheck
                const options = {
                    suggestedName: `${newProjectName}.json`,
                    types: [{
                        description: 'JSON',
                        accept: { 'application/json': ['.json'] },
                    }],
                };
                const fileHandlePromise = ProjectManager.getSaveFileHandle(options)
                fileHandlePromise.then((fileHandle) => {
                    const objNewProjectValues: INewProjectValues = {
                        strProjectName: newProjectName,
                        // strIconSrc: 'https://picsum.photos/50/50',
                        strOwner: 'Ming',
                    }

                    const contents = ProjectFactory.getNewProject(objNewProjectValues)
                    const blob = ProjectManager.getBlob(contents)
                    ProjectManager.writeFile(fileHandle, blob)

                    const objProjectState: IProjectState = {
                        fileHandle: fileHandle,
                        contents: contents,
                    }
                    ProjectManager.setShowProjectStateList([objProjectState])
                    ProjectManager.setEditingProjectState(objProjectState)
                    ProjectManager.toEditPage()
                }).catch((error) => {
                    if (process.env.NODE_ENV === "development") {
                        console.log('ProjectManager')
                        console.log('ProjectManager:\nFunction: createNewProject\n' + error)
                    }
                    Swal.fire({
                        title: '創建失敗',
                        icon: 'error',
                    })
                })
            }
        })
    }

    static alertLoadFileError = (strText?: string): void => {
        Swal.fire({
            title: '加載文件出錯',
            text: strText,
            icon: 'error',
        })
    }

    static openLocalProject = () => {
        const loadFileErrorTest = '非專案文件'
        const options = {
            types: [{
                description: 'JSON',
                accept: {
                    'application/json': ['.json']
                }
            }],
            excludeAcceptAllOption: true,
            multiple: false
        };
        const fileHandlePromise = ProjectManager.getOpenFileHandle(options)
        fileHandlePromise.then((fileHandleList: FileSystemFileHandle[]) => {
            const fileHandle = fileHandleList[0]
            const filePromise = fileHandle.getFile()
            filePromise.then((file: File) => {
                if (file.type === "application/json") {
                    const reader = new FileReader()
                    reader.onload = () => {
                        const fileContents = reader.result
                        if (fileContents && typeof fileContents === 'string') {
                            try {
                                const objJsonData: any = JSON.parse(fileContents.toString())
                                const isProjectInfo = ProjectManager.isVWProjectInfo(objJsonData)
                                if (isProjectInfo) {
                                    const strNewProjectName = file.name.replace(regExpJsonExtension, '')
                                    objJsonData.objRootFile.strFileName = objJsonData.strName = strNewProjectName

                                    const objProjectState: IProjectState = {
                                        fileHandle: fileHandle,
                                        contents: objJsonData as IProjectContents,
                                    }
                                    ProjectManager.setProjectHouseDirectoryHandle(null)
                                    ProjectManager.setShowProjectStateList([objProjectState])
                                } else {
                                    ProjectManager.alertLoadFileError(loadFileErrorTest)
                                }
                            } catch (error) {
                                console.error('ProjectManager: JSON is incomplete\n' + error)
                                ProjectManager.alertLoadFileError(loadFileErrorTest)
                            }
                        }
                    }
                    reader.readAsText(file)
                }
            })
        }).catch((error) => {
            if (process.env.NODE_ENV === "development") {
                console.log('ProjectManager')
                console.error('ProjectManager:\nFunction: openLocalProject\n' + error)
            }
        })
    }

    static openLocalProjectsHouse = () => {
        const directoryHandlePromise = window.showDirectoryPicker()

        directoryHandlePromise.then((directoryHandle: FileSystemDirectoryHandle) => {
            ProjectManager.setProjectHouseDirectoryHandle(null)
            ProjectManager.setShowProjectStateList([])

            const readDirectory = async () => {
                for await (const [strFileName, objHandle] of directoryHandle.entries()) {
                    if (objHandle.kind === "file") {
                        const filePromise = objHandle.getFile()

                        // eslint-disable-next-line no-loop-func
                        await filePromise.then((file) => {
                            const { type } = file as File
                            if ("application/json" === type) {
                                const reader = new FileReader()
                                reader.onload = () => {
                                    const fileContents = reader.result
                                    if (fileContents && typeof fileContents === 'string') {
                                        try {
                                            const objJsonData: any = JSON.parse(fileContents.toString())
                                            const isProjectContents = ProjectManager.isVWProjectInfo(objJsonData)
                                            if (isProjectContents) {
                                                const strNewProjectName = file.name.replace(regExpJsonExtension, '')
                                                objJsonData.objRootFile.strFileName = objJsonData.strName = strNewProjectName

                                                const objProjectState: IProjectState = {
                                                    fileHandle: objHandle as FileSystemFileHandle,
                                                    contents: objJsonData as IProjectContents,
                                                }
                                                ProjectManager.addShowProjectStateList(objProjectState)
                                            }
                                        } catch (error) {
                                            if (process.env.NODE_ENV === "development") {
                                                console.log('ProjectManager')
                                                console.error('ProjectManager\n Function: openLocalProjectsHouse\n ' + error)
                                            }
                                        }
                                    }
                                }
                                reader.readAsText(file as File)
                            }
                        })
                    }
                }
                ProjectManager.setProjectHouseDirectoryHandle(directoryHandle)
            }
            readDirectory()


            // const fileHandlePromise = directoryHandle.getFileHandle('directoryHandle_create', { create: false })
            // fileHandlePromise.then(() => {
            //     console.log('get')
            // }).catch(() => {
            //     console.log('not get')
            // })

            // directoryHandle.removeEntry()
        }).catch((error) => {
            if (process.env.NODE_ENV === "development") {
                console.log('ProjectManager')
                console.error('ProjectManager\n Function: openLocalProjectsHouse\n ' + error)
            }
        })
    }

    static saveEditingRootFile = (objRootFile: FileMangerFile) => {
        const { fileHandle, contents } = ProjectManager.getEditingProjectState()
        if (fileHandle && contents) {
            if (objRootFile.getId() === contents.strId) {
                contents.objRootFile = objRootFile.toFileConstructor()
            }
        }
    }

    static saveEditingProject = (): void => {
        const { fileHandle, contents } = ProjectManager.getEditingProjectState()
        const rootFile = FileManager.getRootFile()
        if (fileHandle && contents) {
            if (rootFile.getId() === contents.strId) {
                ProjectManager.saveEditingRootFile(rootFile)
                contents.strLastEditTime = ProjectManager.getNowDateTimeToString()
                const blob = ProjectManager.getBlob(contents)
                ProjectManager.writeFile(fileHandle, blob)
            } else {
                console.log(rootFile)
                console.log(contents)
                throw new ProjectManagerSaveEditingProjectError('Handle project is not the same as Editing project')
            }
        }
    }

    static getBlob = (contents: any): Blob => new Blob([JSON.stringify(contents, null, 2)], { type: 'application/json;charset=utf-8' })

    static getNowDateTimeToString = (): string => moment().format(DATE_FORMAT)

    static toEditPage = () => FunctionCaller.call(FUNCTION_CALLER_KEY_TO_EDIT_PAGE)

    static getSaveFileHandle = async (options?: any) => {
        const opts = (options) ? options : {
            suggestedName: "VW_Project.json",
            types: [{
                description: 'JSON',
                accept: { 'application/json': ['.json'] },
            }],
        };
        return await window.showSaveFilePicker(opts);
    }

    static getOpenFileHandle = async (options?: any) => {
        const opts = (options) ? options : {
            types: [{
                description: 'JSON',
                accept: {
                    'application/json': ['.json']
                }
            }],
            excludeAcceptAllOption: true,
            multiple: false
        };
        return await window.showOpenFilePicker(opts)
    }

    static getDirectoryHandle = async () => {
        return await window.showDirectoryPicker()
    }

    static writeFile = async (fileHandle: FileSystemFileHandle, contents: Blob) => {
        const writable = await fileHandle.createWritable(); // createWritable
        await writable.write(contents);
        await writable.close();
    }

    static isVWProjectInfo = (objJsonData: object) => {
        if (typeof objJsonData === 'object') {
            const {
                strId,
                strType,
                strName,
                strIconSrc,
                // strOwner,
                strLastEditTime,
                objRootFile,
            } = objJsonData as IProjectContents

            if (typeof strId === "string"
                && typeof strType === "string"
                && typeof strName === "string"
                && typeof strIconSrc === "string"
                // && typeof strOwner === 'string'
                && typeof strLastEditTime === "string"
                && typeof objRootFile === "object") {
                const isFileConstructor = (objFileConstructor: FileConstructor): boolean => {
                    const {
                        strId,
                        boolIsDirectory,
                        strFileName,
                        strData,
                        strDataType,
                        boolIsExpand,
                        arrFileSubFiles
                    } = objFileConstructor as FileConstructor

                    if (typeof strId === 'string'
                        && typeof boolIsDirectory === 'boolean'
                        && typeof strFileName === 'string'
                        && typeof strData === 'string'
                        && typeof strDataType === 'string'
                        && typeof boolIsExpand === 'boolean'
                        && typeof arrFileSubFiles === 'object' && Array.isArray(arrFileSubFiles)) {
                        for (const objSubFileConstructor of arrFileSubFiles) {
                            if (!isFileConstructor(objSubFileConstructor)) {
                                return false
                            }
                        }
                        return true
                    }
                    return false
                }
                return isFileConstructor(objRootFile)
            }
        }
        return false
    }

    static checkNewProjectName = (newProjectName: string): IProjectNameCheck => {
        const regExp = /[\\|/|:|\*|\?|"|<|>|]/g

        newProjectName = newProjectName.trim()
        let result: IProjectNameCheck = {
            state: false,
            message: '',
            newProjectName: newProjectName,
        }

        if (newProjectName.length === 0) {
            result.message = '必須提供專案名稱'
            return result
        } else if (regExp.test(newProjectName)) { // 檢查名稱前後是否有空格
            result.message = `名稱 ${newProjectName} 不能作為專案名稱。請選擇不同的名稱。`
            return result
        }
        result.state = true
        return result
    }
}

// Test Data
const TestProjectList: IProjectContents[] = [{
    strId: '1',
    strName: 'project_1',
    strType: 'vw_project',
    strIconSrc: 'https://picsum.photos/100/100',
    strOwner: 'Ming',
    strLastEditTime: '2020/06/03 01:05:30',
    objRootFile: {
        strId: "1",
        boolIsDirectory: true,
        strFileName: "root",
        strData: "",
        strDataType: "directory",
        boolIsExpand: true,
        arrFileSubFiles: [
            {
                strId: "1-1",
                boolIsDirectory: false,
                strFileName: "file1.txt",
                strData: "file1",
                strDataType: "text",
                boolIsExpand: false,
                arrFileSubFiles: []
            },
            {
                strId: "1-2",
                boolIsDirectory: true,
                strFileName: "dir2",
                strData: "",
                strDataType: "directory",
                boolIsExpand: true,
                arrFileSubFiles: [
                    {
                        strId: "1-2-1",
                        boolIsDirectory: false,
                        strFileName: "html.html",
                        strData: '<!DOCTYPE html><html lang="en"><head><link rel="stylesheet" href="./style.css"></head><body><h1>Hello World!</h1><img src="../img.png" alt=""></body><script src="./javascript.js"></script></html>',
                        strDataType: "text",
                        boolIsExpand: false,
                        arrFileSubFiles: []
                    },
                    {
                        strId: "1-2-2",
                        boolIsDirectory: false,
                        strFileName: "style.css",
                        strData: "body {background-color: rgb(255,0,0)}",
                        strDataType: "text",
                        boolIsExpand: false,
                        arrFileSubFiles: []
                    },
                    {
                        strId: "1-2-3",
                        boolIsDirectory: true,
                        strFileName: "dir2-3",
                        strData: "",
                        strDataType: "directory",
                        boolIsExpand: true,
                        arrFileSubFiles: [
                            {
                                strId: "1-2-3-1",
                                boolIsDirectory: false,
                                strFileName: "file2-3-1.tx",
                                strData: "file2-3-1",
                                strDataType: "text",
                                boolIsExpand: false,
                                arrFileSubFiles: []
                            },
                        ]
                    },
                    {
                        strId: "1-2-4",
                        boolIsDirectory: false,
                        strFileName: "javascript.js",
                        strData: "console.log('Hello World!')",
                        strDataType: "text",
                        boolIsExpand: false,
                        arrFileSubFiles: []
                    },
                ]
            },
            {
                strId: "3",
                boolIsDirectory: false,
                strFileName: "img.png",
                strData: "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
                strDataType: "image",
                boolIsExpand: false,
                arrFileSubFiles: []
            },
        ]
    }
},
{
    strId: '2',
    strName: 'project_2',
    strType: 'vw_project',
    strIconSrc: 'https://picsum.photos/50/50',
    strOwner: 'Ming',
    strLastEditTime: '2020/06/03 01:05:30',
    objRootFile: {
        strId: '2',
        boolIsDirectory: true,
        strFileName: 'project02',
        strData: "",
        strDataType: "directory",
        boolIsExpand: true,
        arrFileSubFiles: []
    }
}]
// ProjectManager.showProjectList = TestProjectList