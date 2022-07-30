import FileManager from "./FileManager";
import { FileGetFileByPathError } from "../../../tools/Error";

export interface FileConstructor {
    strId: string,
    boolIsDirectory: boolean,
    strFileName: string,
    strData: string,
    strDataType: string,
    boolIsExpand: boolean,
    arrFileSubFiles?: Array<FileConstructor>,
    objFileParent?: File | undefined,
    deep?: number
}


export default class File implements FileConstructor {
    strId: string = "";
    boolIsDirectory: boolean = false;
    strFileName: string = "";
    arrStrFileExtension: Array<string> = [];
    // numFileType: number = 0;
    strData: string = "";
    strDataType: string = "";
    boolIsExpand: boolean = false;
    arrFileSubFiles: Array<File> = [];
    objFileParent!: File | undefined;

    constructor(fileData: FileConstructor) {
        this.strId = fileData.strId;
        this.boolIsDirectory = fileData.boolIsDirectory;
        this.strFileName = fileData.strFileName;
        // this.numFileType = fileData.numFileType;
        this.strDataType = fileData.strDataType;
        this.buildFileExtension()
        this.strData = fileData.strData;
        this.boolIsExpand = fileData.boolIsExpand;
        this.objFileParent = fileData.objFileParent;
        if (fileData.arrFileSubFiles) {
            this.arrFileSubFiles = fileData.arrFileSubFiles.map((item: FileConstructor) => {
                item.objFileParent = this;
                return new File(item);
            })
        }
        this.sortSubFiles()
        FileManager.getFileMap().set(fileData.strId, this)
    }

    getPath = () => {
        let filePath = '/' + this.getFileName();
        let fileParent = this.objFileParent
        while (fileParent?.getFileName().toUpperCase() !== 'ROOT') {
            filePath = '/' + fileParent?.getFileName() + filePath
            fileParent = fileParent?.objFileParent!
        }
        return filePath
    }

    delete = () => {
        this.arrFileSubFiles.forEach(subFile => subFile.delete())
        FileManager.deleteSelectedFile(this)
        FileManager.deleteOpenFile(this)
        FileManager.getFileMap().delete(this.getId())

        const fileParent = this.getParent()
        if (fileParent) {
            const fileParentSubFiles = fileParent.getSubFiles()
            const newSubFiles = fileParentSubFiles.filter(file => file.getId() !== this.getId())
            fileParent.setSubFiles(newSubFiles)
        }
    }

    isSubFileOf = (objFileSuperFile: File): boolean => {
        // const numFileType = objFileSuperFile.getFileType();
        let parentFile: File = this.getParent()!;
        if (parentFile && objFileSuperFile.isDirectory()) {
            return (parentFile.getId() === objFileSuperFile.getId()) ?
                true : parentFile.isSubFileOf(objFileSuperFile)
        }
        return false
    }

    addSubFile = (objFile: File) => {
        if (this.isDirectory()) {
            console.log('addSubFile')
            const arrFileNewSubFIles = this.arrFileSubFiles.map(file => {
                if (file.getFileName() === objFile.getFileName()) {
                    const flag = window.confirm(`目的地資料夾中已經存在名稱 '${file.getFileName()}' 的檔案或資料夾。要加以取代嗎?`)
                    return (flag) ? objFile : file
                } else {
                    return file
                }
            })
            objFile.setParent(this)
            this.arrFileSubFiles.push(objFile)
            this.sortSubFiles()
        }
    }

    private sortSubFiles = () => {
        // Folder 在前 File 在後，按首字母遞增排序，相同首字符，按長度排序
        this.arrFileSubFiles.sort((f1, f2) => {
            if (f1.isDirectory() === f2.isDirectory()) {
                const s1 = f1.strFileName.charAt(0)
                const s2 = f2.strFileName.charAt(0)
                return (s1.toLocaleUpperCase() === s2.toLocaleUpperCase()) ?
                    f1.strFileName.length - f2.strFileName.length : // 相同首字符，按長度排序
                    f1.strFileName.localeCompare(f2.strFileName) // 按首字母遞增排序
            } else { // Folder 在前 File 在後
                return (f2.isDirectory()) ? 1 : -1
            }
        })

        // sort subfiles with filenames by ASC(遞增)
        // this.arrFileSubFiles.sort((f1, f2) => {
        //     if(f1.getIsDirectory() === f2.getIsDirectory()){

        //         return f1.strFileName.localeCompare(f2.strFileName)
        //     }
        //     return 0;
        // })
        // // 相同字符，按長度排序
        // this.arrFileSubFiles.sort((f1, f2) => {
        //     const s1 = f1.strFileName.charAt(0)
        //     const s2 = f2.strFileName.charAt(0)
        //     if (s1.toLocaleUpperCase() === s2.toLocaleUpperCase()) {
        //         const temp = f1.strFileName.length - f2.strFileName.length
        //         return (temp != 0) ? temp : f1.strFileName.localeCompare(f2.strFileName)
        //     }
        //     return 0;
        // })
    }

    static getFileNameExtensionStrArray = (strFileName: string) => {
        const arrString = strFileName.split('.')
        return (arrString.length > 1) ?
            arrString.slice(1) :
            []
    }
    private buildFileExtension = () => {
        this.arrStrFileExtension = File.getFileNameExtensionStrArray(this.getFileName())
    }
    getFileExtension = () => this.arrStrFileExtension

    getId = () => this.strId
    setId = (strNewId: string) => this.strId = strNewId

    isDirectory = () => this.boolIsDirectory
    setIsDirectory = (boolIsDirectoryState: boolean) => this.boolIsDirectory = boolIsDirectoryState

    // getFileType = () => this.numFileType
    // setFileType = (numNewFileType: number) => this.numFileType = numNewFileType

    isExpand = () => this.boolIsExpand
    setIsExpand = (boolIsExpandState: boolean) => {
        if (this.isDirectory()) this.boolIsExpand = boolIsExpandState
    }

    getData = () => this.strData
    setData = (strNewData: string) => this.strData = strNewData

    getDataType = () => this.strDataType

    getFileName = () => this.strFileName
    setFileName = (strNewFileName: string) => {
        this.strFileName = strNewFileName
        if (!(this.isDirectory())) {
            this.buildFileExtension()
            const arrStrFileExtensionData = this.getFileExtension()
            // if (arrStrFileExtensionData.length === 0) {
            //     this.setFileType(FileManager.getFileType('unknown'))
            // } else {
            //     this.setFileType(FileManager.getFileType(arrStrFileExtensionData[0]))
            // }
        }
        this.getParent()?.sortSubFiles()
    }

    getSubFiles = () => this.arrFileSubFiles
    setSubFiles = (arrFileNewSubFiles: Array<File>) =>
        this.arrFileSubFiles = arrFileNewSubFiles

    getParent = () => this.objFileParent
    setParent = (objFileNewParent: File) => {
        if (objFileNewParent.isDirectory()) {
            this.objFileParent = objFileNewParent
        } else {
            this.objFileParent = undefined
        }
    }

    static checkFileName = (newFileName: string) => {
        const regExp = /^\s|\s$/g

        if (newFileName.replaceAll(/\s/g, '').length === 0) {
            return [false, '必須提供檔案或資料夾名稱']
        } else if (regExp.test(newFileName)) {
            return [false, `名稱 ${newFileName} 不能作為檔案或資料夾名稱。請選擇不同的名稱。`]
        }
        return [true, '']
    }
    checkFileNewName = (newFileName: string) => {
        // console.log(newFileName)
        const [fileNameState, message] = File.checkFileName(newFileName)
        const parentFile = this.getParent()

        if (fileNameState && parentFile) {
            let checkNameExistedFlag = false
            for (let file of parentFile.getSubFiles()!) {
                if (file.getId() !== this.getId()
                    && file.getFileName().toLocaleLowerCase() === newFileName.toLocaleLowerCase()) {
                    checkNameExistedFlag = true
                    break
                }
            }
            if (checkNameExistedFlag) {
                return [false, `這個位置已經存在檔案或資料夾 ${newFileName} 。請選擇不同名稱。`]
            }
        }
        return [fileNameState, message]
    }

    isRootFile = () => this === FileManager.getRootFile()

    getSubFileByFileName = (strFileName: string) => {
        for(const objFile of this.getSubFiles()){
            if(objFile.getFileName() === strFileName) return objFile
        }
        return undefined
    }
    getFileByPath = (strFilePath: string) => {
        if (strFilePath.length === 0) return FileManager.getRootFile()
        let currentFile: File | undefined = (strFilePath.charAt(0) === '/') ?
            FileManager.getRootFile() :
            this
        const arrStrPath = strFilePath.split('/')
        for (const fileName of arrStrPath) {
            switch (fileName) {
                case '':
                case '.':
                    continue;
                case '..':
                    currentFile = currentFile.getParent()!
                    break
                default:
                    currentFile = currentFile.getSubFileByFileName(fileName)
            }
            if (!currentFile) {
                throw new FileGetFileByPathError(`Pathname '${fileName}' does not exist`)
            }
        }
        return currentFile
    }
}