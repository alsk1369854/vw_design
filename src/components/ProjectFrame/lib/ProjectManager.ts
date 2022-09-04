import Swal from 'sweetalert2'
import moment from 'moment'

import { ProjectManagerSaveEditingProjectError } from '../../../tools/Error/index'
import { IProjectContents, IProjectNameCheck, DATE_FORMAT, IProjectState, IInitialEditingProjectState } from './ProjectInterfaceCollection'
import FunctionCaller from '../../../tools/FunctionCaller'
import { FUNCTION_CALLER_KEY_TO_EDIT_PAGE } from '../index'
import { FUNCTION_CALLER_KEY_UPDATE_SHOW_PROJECT_LIST } from '../ProjectListFrame/index'
import FileManager from '../../FileManager/lib/FileManager'
import FileMangerFile, { FileConstructor } from '../../FileManager/lib/File';
import ProjectFactory, { INewProjectValues } from './ProjectFactory';
import { file } from 'jszip'


const regExpJsonExtension = /.json$/ig


export default class ProjectManager {
    static readonly initialEditingProjectState: IInitialEditingProjectState = {
        fileHandle: undefined,
        contents: {
            strId: 'initial_edit_state_cannot_be_edited',
            strName: 'VW_DESIGN',
            strType: 'vw_project',
            strIconSrc: 'https://picsum.photos/50/50',
            strOwner: 'VW_DESIGN',
            strLastEditTime: '2022/01/01, 00:00:00',
            objRootFile: {
                strId: 'initial_edit_state_cannot_be_edited',
                boolIsDirectory: true,
                strFileName: 'root',
                strData: "",
                strDataType: "directory",
                boolIsExpand: true,
                arrFileSubFiles: []
            }
        },
    }

    static editingProjectState: IProjectState = { ...ProjectManager.initialEditingProjectState }

    static projectHomeDirectoryHandle: FileSystemDirectoryHandle | null = null
    static showProjectStateList: IProjectState[] = []

    static getEditingProjectState = (): IProjectState => ProjectManager.editingProjectState
    static setEditingProjectState = (objNewEditingProjectState: IProjectState) => {
        ProjectManager.saveEditingProject()
        ProjectManager.editingProjectState = objNewEditingProjectState
        const { contents } = ProjectManager.editingProjectState
        if (contents) FileManager.setRootFile(contents.objRootFile)
    }

    static getProjectHomeDirectoryHandle = () => ProjectManager.projectHomeDirectoryHandle
    static setProjectHomeDirectoryHandle = (newProjectHomeDirectoryHandle: FileSystemDirectoryHandle | null) => {
        ProjectManager.setShowProjectStateList([])
        ProjectManager.projectHomeDirectoryHandle = newProjectHomeDirectoryHandle
        if (newProjectHomeDirectoryHandle) {
            ProjectManager.setEditingProjectState({ ...ProjectManager.initialEditingProjectState })
            const readDirectory = async () => {
                for await (const [strFileName, objHandle] of newProjectHomeDirectoryHandle.entries()) {
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
                                                console.error('ProjectManager\n Function: openLocalProjectsHome\n ' + error)
                                            }
                                        }
                                    }
                                }
                                reader.readAsText(file as File)
                            }
                        })
                    }
                }
            }
            readDirectory()
        }
    }
    static reloadProjectHomeDirectoryHandle = () => {
        const objDirectoryHandle: FileSystemDirectoryHandle | null = ProjectManager.getProjectHomeDirectoryHandle()
        if (objDirectoryHandle) ProjectManager.setProjectHomeDirectoryHandle(objDirectoryHandle)
    }

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
                const checkProjectCanCreateFunc = async () => {
                    const projectHomeDirectoryHandle: FileSystemDirectoryHandle | null = ProjectManager.getProjectHomeDirectoryHandle()
                    const objProjectNameCheck = ProjectManager.checkNewProjectName(strProjectName)
                    const { state, newProjectName } = objProjectNameCheck
                    if (projectHomeDirectoryHandle && state) { // 有 select Project Home
                        let boolCanCreate = true
                        const strNewProjectFileName = newProjectName + '.json'
                        for await (const strSubFileName of projectHomeDirectoryHandle.keys()) {
                            if (strSubFileName.toLocaleUpperCase() === strNewProjectFileName.toLocaleUpperCase()) {
                                objProjectNameCheck.message = `專案名稱 '${newProjectName}' 已存在，請選用其他名稱`
                                boolCanCreate = false
                                break
                            }
                        }
                        if (boolCanCreate) return objProjectNameCheck
                    } else if (state) { // 無 select Project Home
                        return objProjectNameCheck
                    }
                    Swal.showValidationMessage(objProjectNameCheck.message)
                }
                return checkProjectCanCreateFunc()
            },
        }).then((response) => {
            const { isConfirmed, value: objProjectNameCheck } = response
            if (isConfirmed) {
                const projectCreateFunc = async () => {
                    const { newProjectName } = objProjectNameCheck as IProjectNameCheck
                    const objNewProjectValues: INewProjectValues = {
                        strProjectName: newProjectName,
                        // strIconSrc: 'https://picsum.photos/50/50',
                        strOwner: 'VW DESIGN',
                    }
                    const options = {
                        suggestedName: `${newProjectName}.json`,
                        types: [{
                            description: 'JSON',
                            accept: { 'application/json': ['.json'] },
                        }],
                    };

                    const projectHomeDirectoryHandle: FileSystemDirectoryHandle | null = ProjectManager.getProjectHomeDirectoryHandle()
                    if (projectHomeDirectoryHandle) { // 有 Select Project Home
                        const strNewProjectFileName = newProjectName + '.json'
                        const objFileHandle = await projectHomeDirectoryHandle.getFileHandle(strNewProjectFileName, { create: true })
                        const contents = ProjectFactory.getNewProject(objNewProjectValues)
                        const blob = ProjectManager.getBlob(contents)
                        await ProjectManager.writeFile(objFileHandle, blob)
                        ProjectManager.reloadProjectHomeDirectoryHandle()
                    } else { // 沒有 Select Project Home
                        const objFileHandlePromise = ProjectManager.getSaveFileHandle(options)
                        objFileHandlePromise.then((objFileHandle) => {
                            const contents = ProjectFactory.getNewProject(objNewProjectValues)
                            const blob = ProjectManager.getBlob(contents)
                            ProjectManager.writeFile(objFileHandle, blob)

                            const objProjectState: IProjectState = {
                                fileHandle: objFileHandle,
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
                }
                projectCreateFunc()
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
            const fileHandle: FileSystemFileHandle = fileHandleList[0]
            fileHandle.requestPermission({ mode: 'readwrite' })
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
                                    ProjectManager.setProjectHomeDirectoryHandle(null)
                                    ProjectManager.setEditingProjectState(objProjectState)
                                    ProjectManager.setShowProjectStateList([objProjectState])
                                } else {
                                    ProjectManager.alertLoadFileError(loadFileErrorTest)
                                }
                            } catch (error) {
                                if (process.env.NODE_ENV === "development") {
                                    console.error('ProjectManager: JSON is incomplete\n' + error)
                                }
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

    static openLocalProjectsHome = () => {
        const directoryHandlePromise = window.showDirectoryPicker()

        directoryHandlePromise.then((directoryHandle: FileSystemDirectoryHandle) => {
            directoryHandle.requestPermission({ mode: 'readwrite' })
            ProjectManager.setProjectHomeDirectoryHandle(directoryHandle)

            // directoryHandle.removeEntry()
        }).catch((error) => {
            if (process.env.NODE_ENV === "development") {
                console.log('ProjectManager')
                console.error('ProjectManager\n Function: openLocalProjectsHome\n ' + error)
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

// Start initiation
FileManager.setRootFile({ ...ProjectManager.initialEditingProjectState.contents.objRootFile })
// End initiation

