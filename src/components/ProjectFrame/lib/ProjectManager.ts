import Swal from 'sweetalert2'
import moment from 'moment'
import { nanoid } from 'nanoid';

import { ProjectManagerSaveEditingProjectError } from '../../../tools/Error/index'
import { IProjectInfo, IProjectNameCheck, DATE_FORMAT } from './IProjectInfo'
import FunctionCaller from '../../../tools/FunctionCaller'
import { FUNCTION_CALLER_KEY_TO_EDIT_PAGE } from '../index'
import { FUNCTION_CALLER_KEY_SET_ARR_PROJECT_LIST } from '../ProjectListFrame/index'
import FileManager from '../../FileManager/lib/FileManager'
import { FileConstructor } from '../../FileManager/lib/File';

interface IEditingProjectState {
    fileHandle: FileSystemFileHandle | undefined,
    contents: IProjectInfo | undefined
}

const TestProjectList = [{
    strId: '1',
    strName: 'project01',
    strType: 'vw_project',
    strIconSrc: 'https://picsum.photos/100/100',
    strOwner: 'Ming',
    strLastEditTime: '2020/06/03 01:05:30',
    objRootFile: {
        strId: '1',
        boolIsDirectory: true,
        strFileName: 'project01',
        strData: "",
        strDataType: "directory",
        boolIsExpand: true,
        arrFileSubFiles: []
    }
},
{
    strId: '2',
    strName: 'project02',
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

export default class ProjectManager {
    static editingProjectState: IEditingProjectState = {
        fileHandle: undefined,
        contents: undefined,
    }
    static showProjectList: IProjectInfo[] = TestProjectList

    static getEditingProjectState = () => ProjectManager.editingProjectState
    static setEditingProjectState = (objNewEditingProjectState: IEditingProjectState) =>
        ProjectManager.editingProjectState = objNewEditingProjectState

    static createProject = () => {
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
                const IProjectNameCheck = ProjectManager.checkNewProjectName(strProjectName)
                const { state, message } = IProjectNameCheck
                if (state) return IProjectNameCheck
                Swal.showValidationMessage(message)
            },
        }).then((response) => {
            const { isConfirmed, value } = response
            if (isConfirmed) {
                const { newProjectName } = value as IProjectNameCheck
                const options = {
                    suggestedName: `${newProjectName}.json`,
                    types: [{
                        description: 'JSON',
                        accept: { 'application/json': ['.json'] },
                    }],
                };
                const fileHandlePromise = ProjectManager.getSaveFileHandle(options)
                fileHandlePromise.then((fileHandle) => {
                    const projectId = nanoid()
                    const contents: IProjectInfo = {
                        strId: projectId,
                        strName: newProjectName,
                        strType: 'vw_project',
                        strIconSrc: 'https://picsum.photos/50/50',
                        strOwner: 'Ming',
                        strLastEditTime: this.getNowDateTimeToString(),
                        objRootFile: {
                            strId: projectId,
                            boolIsDirectory: true,
                            strFileName: newProjectName,
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
                    // const blob = new Blob([JSON.stringify(contents)], { type: 'application/json;charset=utf-8' })
                    const blob = this.getBlob(contents)
                    ProjectManager.writeFile(fileHandle, blob)
                    ProjectManager.setEditingProjectState({ fileHandle, contents })
                    FileManager.setRootFile(contents.objRootFile)
                    ProjectManager.showProjectList = [contents]
                    ProjectManager.toEditPage()
                }).catch((error) => {
                    if (process.env.NODE_ENV === "development") {
                        console.log('ProjectManager:\nFunction: createProject\n' + error)
                    }
                    Swal.fire({
                        title: '創建失敗',
                        icon: 'error',
                    })
                })
            }
        })
    }

    static openLocalProject = () => {
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
            fileHandle.getFile().then((file: File) => {
                if (file.type === "application/json") {
                    const reader = new FileReader()
                    reader.onload = () => {
                        const fileContent = reader.result
                        if (fileContent) {
                            try {
                                const objJsonData: any = JSON.parse(fileContent.toString())
                                const isProjectInfo = ProjectManager.isVWProjectInfo(objJsonData)
                                if(isProjectInfo){

                                }else{
                                    
                                }
                                console.log('isProjectInfo: ' + isProjectInfo)
                            } catch (error) {
                                console.error('ProjectManager: JSON is incomplete\n' + error)
                                Swal.fire({
                                    title: '加載文件出錯',
                                    text: '非專案文件',
                                    icon: 'error',
                                })
                            }
                        }
                    }
                    reader.readAsText(file)
                }
            })
        }).catch((error) => {
            if (process.env.NODE_ENV === "development") {
                console.error('ProjectManager:\nFunction: openLocalProject\n' + error)
            }
        })
    }

    static saveEditingProject = (): void => {
        const { fileHandle, contents } = this.getEditingProjectState()
        const rootFile = FileManager.getRootFile()
        if (fileHandle && contents) {
            if (rootFile.getId() === contents.strId) {
                contents.objRootFile = rootFile.toFileConstructor()
                contents.strLastEditTime = this.getNowDateTimeToString()
                const blob = this.getBlob(contents)
                ProjectManager.writeFile(fileHandle, blob)
            } else {
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
            } = objJsonData as IProjectInfo

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
                        for(const objSubFileConstructor of arrFileSubFiles){
                            if(!isFileConstructor(objSubFileConstructor)){
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