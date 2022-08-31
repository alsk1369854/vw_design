import Swal from 'sweetalert2'
import moment from 'moment'

import { ProjectNameCheck, DATE_FORMAT } from './IProjectInfo'

export default class ProjectManager {
    static createProject = () => {
        Swal.fire({
            title: 'Project Name',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Create',
            showLoaderOnConfirm: true,
            preConfirm: (strProjectName) => {
                const result = ProjectManager.checkNewProjectName(strProjectName)
                const { state, message } = result
                if (state) return result
                Swal.showValidationMessage(message)
            },
        }).then((result) => {
            const { isConfirmed, value } = result
            if (isConfirmed) {
                const { newProjectName } = value as ProjectNameCheck
                const options = {
                    suggestedName: `${newProjectName}.json`,
                    types: [{
                        description: 'JSON',
                        accept: { 'text/plain': ['.json'] },
                    }],
                };
                const fileHandlePromise = ProjectManager.getNewFileHandle(options)
                fileHandlePromise.then((fileHandle) => {
                    const contents = {
                        name: newProjectName,
                        type: 'vw_project',
                        owner: 'Ming',
                        lastEditTime: moment().format(DATE_FORMAT),
                        rootFile: {
                            strId: "root",
                            boolIsDirectory: true,
                            strFileName: newProjectName,
                            strData: "",
                            strDataType: "directory",
                            boolIsExpand: true,
                            arrFileSubFiles: []
                        }
                    }
                    // const blob = new Blob([JSON.stringify(contents)], { type: 'application/json;charset=utf-8' })
                    const blob = new Blob([JSON.stringify(contents, null, 2)], { type: 'application/json;charset=utf-8' }) // dev
                    ProjectManager.writeFile(fileHandle, blob)
                    
                }).catch(() => {
                    Swal.fire({
                        title: '創建失敗',
                        icon: 'error',
                    })
                })
            }
        })
    }

    static getNewFileHandle = async (options?: any) => {
        const opts = (options) ? options : {
            suggestedName: "VW_Project.json",
            types: [{
                description: 'JSON',
                accept: { 'text/plain': ['.json'] },
            }],
        };
        return await window.showSaveFilePicker(opts);
        // const targetFileObject = await window.showSaveFilePicker(opts);
        // var debug = { hello: "worldTest", aa: 'bb' };
        // var blob = new Blob([JSON.stringify(debug, null, 2)], { type: 'application/json;charset=utf-8' });

        // writeFile(targetFileObject, blob)
    }
    static writeFile = async (fileHandle: FileSystemFileHandle, contents: Blob) => {
        const writable = await fileHandle.createWritable(); // createWritable
        await writable.write(contents);
        await writable.close();
    }
    static checkNewProjectName = (newProjectName: string): ProjectNameCheck => {
        const regExp = /[\\|/|:|\*|\?|"|<|>|]/g

        newProjectName = newProjectName.trim()
        let result: ProjectNameCheck = {
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
