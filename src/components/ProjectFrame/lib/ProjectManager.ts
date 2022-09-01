import Swal from 'sweetalert2'
import moment from 'moment'
import { nanoid } from 'nanoid';

import { ProjectManagerSaveEditingProjectError } from '../../../tools/Error/index'
import { IProjectInfo, IProjectNameCheck, DATE_FORMAT } from './IProjectInfo'
import FunctionCaller from '../../../tools/FunctionCaller'
import { FUNCTION_CALLER_KEY_TO_EDIT_PAGE } from '../index'
import { FUNCTION_CALLER_KEY_SET_ARR_PROJECT_LIST } from '../ProjectListFrame/index'
import FileManager from '../../FileManager/lib/FileManager'


interface IEditingProjectState {
    fileHandle: FileSystemFileHandle | undefined,
    contents: IProjectInfo | undefined
}

const TestProjectList = [{
    id: '1',
    name: 'project01',
    type: 'vw_project',
    iconSrc: 'https://picsum.photos/100/100',
    owner: 'Ming',
    lastEditTime: '2020/06/03 01:05:30',
    rootFile: {
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
    id: '2',
    name: 'project02',
    type: 'vw_project',
    iconSrc: 'https://picsum.photos/50/50',
    owner: 'Ming',
    lastEditTime: '2020/06/03 01:05:30',
    rootFile: {
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
                        accept: { 'text/plain': ['.json'] },
                    }],
                };
                const fileHandlePromise = ProjectManager.getNewFileHandle(options)
                fileHandlePromise.then((fileHandle) => {
                    const projectId = nanoid()
                    const contents: IProjectInfo = {
                        id: projectId,
                        name: newProjectName,
                        type: 'vw_project',
                        iconSrc: 'https://picsum.photos/50/50',
                        owner: 'Ming',
                        lastEditTime: this.getNowDateTimeToString(),
                        rootFile: {
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
                    FileManager.setRootFile(contents.rootFile)
                    ProjectManager.showProjectList = [contents]
                    ProjectManager.toEditPage()
                }).catch((error) => {
                    if(process.env.NODE_ENV === "development"){
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

    static saveEditingProject = (): void => {
        const { fileHandle, contents } = this.getEditingProjectState()
        const rootFile = FileManager.getRootFile()
        if (fileHandle && contents) {
            if (rootFile.getId() === contents.id) {
                contents.rootFile = rootFile.toFileConstructor()
                contents.lastEditTime = this.getNowDateTimeToString()
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

    static getNewFileHandle = async (options?: any) => {
        const opts = (options) ? options : {
            suggestedName: "VW_Project.json",
            types: [{
                description: 'JSON',
                accept: { 'text/plain': ['.json'] },
            }],
        };
        return await window.showSaveFilePicker(opts);
    }

    static writeFile = async (fileHandle: FileSystemFileHandle, contents: Blob) => {
        const writable = await fileHandle.createWritable(); // createWritable
        await writable.write(contents);
        await writable.close();
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
