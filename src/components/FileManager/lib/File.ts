import FileManager, { FileManager as staticFileManager } from "./FileManager";
import { FileGetFileByPathError } from "../../../tools/Error";
// import Swal from 'sweetalert2'

export interface FileConstructor {
    strId: string,
    boolIsDirectory: boolean,
    strFileName: string,
    strData: string,
    strDataType: string,
    boolIsExpand: boolean,
    arrFileSubFiles: Array<FileConstructor>,
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
        FileManager.deleteCuttingFile(this)
        FileManager.getFileMap().delete(this.getId())

        const fileParent = this.getParent()
        if (fileParent) {
            // fileParent.removeSubFile(this)
            const fileParentSubFiles = fileParent.getSubFiles()
            const newSubFiles = fileParentSubFiles.filter(file => file.getId() !== this.getId())
            fileParent.setSubFiles(newSubFiles)
        }
    }

    private removeSubFile = (objFile: File) => {
        if (this.isDirectory()) {
            const newSubFiles = this.getSubFiles().filter(file => file.getId() !== objFile.getId())
            this.setSubFiles(newSubFiles)
        }
    }

    isSubFileOf = (objFileSuperFile: File): boolean => {
        if (!objFileSuperFile.isDirectory()) return false
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
            objFile.setParent(this)
            this.arrFileSubFiles.push(objFile)
        }
    }

    private sortSubFiles = () => {

        // Folder ?????? File ??????????????????????????????
        this.arrFileSubFiles.sort((f1, f2) => {
            if (f1.isDirectory() === f2.isDirectory()) {
                return f1.strFileName.localeCompare(f2.strFileName) // ?????????????????????
            } else { // Folder ?????? File ??????
                return (f2.isDirectory()) ? 1 : -1
            }
        })
        // Folder ?????? File ?????????????????????????????????????????????????????????????????????
        // this.arrFileSubFiles.sort((f1, f2) => {
        //     if (f1.isDirectory() === f2.isDirectory()) {
        //         const s1 = f1.strFileName.charAt(0)
        //         const s2 = f2.strFileName.charAt(0)
        //         return (s1.toLocaleUpperCase() === s2.toLocaleUpperCase()) ?
        //             f1.strFileName.length - f2.strFileName.length : // ?????????????????????????????????
        //             f1.strFileName.localeCompare(f2.strFileName) // ????????????????????????
        //     } else { // Folder ?????? File ??????
        //         return (f2.isDirectory()) ? 1 : -1
        //     }
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
        if (!this.isDirectory()) {
            this.buildFileExtension()
            // const arrStrFileExtensionData = this.getFileExtension()
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
        const regExp = /[\\|/|:|\*|\?|"|<|>|]/g

        newFileName = newFileName.trim()
        const result = {
            state: false,
            message: '',
            newFileName: newFileName,
        }

        if (newFileName.length === 0) { // ????????????????????????
            result.message = '????????????????????????????????????'
            return result
        } else if (regExp.test(newFileName)) { // ?????????????????????????????????
            result.message = `?????? ${newFileName} ??????????????????????????????????????????????????????????????????`
            return result
        }
        result.state = true
        return result
    }
    checkFileNewName = (newFileName: string) => {
        // console.log(newFileName)
        const result = File.checkFileName(newFileName)
        const { state } = result
        const parentFile = this.getParent()

        // ????????????????????????
        if (state && parentFile) {
            let checkNameExistedFlag = false
            for (let file of parentFile.getSubFiles()!) {
                if (file.getId() !== this.getId()
                    && file.getFileName().toLocaleLowerCase() === newFileName.toLocaleLowerCase()) {
                    checkNameExistedFlag = true
                    break
                }
            }
            if (checkNameExistedFlag) {
                result.state = false
                result.message = `?????????????????????????????????????????? ${newFileName} ???????????????????????????`
                return result
            }
        }
        return result
    }

    isRootFile = () => this === FileManager.getRootFile()

    getSubFileByFileName = (strFileName: string) => {
        for (const objFile of this.getSubFiles()) {
            if (objFile.getFileName() === strFileName) return objFile
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

    subFileNameIsExist = (strFileName: string) => {
        for (const file of this.getSubFiles()) {
            if (file.getFileName().toUpperCase() === strFileName.toUpperCase()) {
                return file
            }
        }
        return false
    }

    pasteFiles = (arrFileConstructor: FileConstructor[]) => {
        if (this.isDirectory()) {
            // check cutting files
            if (FileManager.cuttingFileIsExists(this)) return FileManager.cleanCuttingFiles()
            const arrFileSetCuttingDirectoryFiles = FileManager.getSetCuttingDirectoryFiles()
            for (const directoryFile of arrFileSetCuttingDirectoryFiles) {
                if (this.isSubFileOf(directoryFile)) return FileManager.cleanCuttingFiles()
            }
            FileManager.getCuttingFiles().forEach(file => file.delete())

            // start paste
            const arrFiles = arrFileConstructor.map(fileConstructor => {
                const baseFileFullName = fileConstructor.strFileName
                const firstPointIndex = baseFileFullName.indexOf('.')
                const pasteFileFirstName = baseFileFullName.substring(0, firstPointIndex)
                const pasteExtension = baseFileFullName.substring(firstPointIndex)

                let count = 1;
                let pasteFileFullName = baseFileFullName
                let boolTryNextName = this.subFileNameIsExist(pasteFileFullName)
                while (boolTryNextName) {
                    if (count === 1) {
                        pasteFileFullName = `${pasteFileFirstName} copy${pasteExtension}`
                    } else {
                        pasteFileFullName = `${pasteFileFirstName} copy ${count}${pasteExtension}`
                    }
                    boolTryNextName = this.subFileNameIsExist(pasteFileFullName)
                    count++
                }
                fileConstructor.strFileName = pasteFileFullName
                staticFileManager.getIdAgain(fileConstructor)
                return new File(fileConstructor)
            })
            arrFiles.forEach(file => this.addSubFile(file))
            this.sortSubFiles()
            this.setIsExpand(true)
        }
    }

    moveToThisFile = (arrFile: File[]) => {
        if (this.isDirectory()) {
            for (const file of arrFile) {
                const fileNameIsExist = this.subFileNameIsExist(file.getFileName())
                const fileOldParentFile = file.getParent()
                if (fileNameIsExist) {
                    // Swal.fire({
                    //     title: `??????????????????????????????????????? '${file.getFileName()}' ???????????????????????????????????????????`,
                    //     // text: `??????????????????????????????????????? '${file.getFileName()}' ???????????????????????????????????????????`,
                    //     // icon: 'warning',
                    //     showCancelButton: true,
                    //     // position:'top',
                    //     // background: '#252526',
                    //     confirmButtonColor: '#3085d6',
                    //     cancelButtonColor: '#d33',
                    //     confirmButtonText: 'Yes!'
                    // }).then((result) => {
                    //     if (result.isConfirmed) {
                    //         fileNameIsExist.delete()
                    //         fileOldParentFile?.removeSubFile(file)
                    //         this.addSubFile(file)
                    //     }
                    // })
                    const cover = window.confirm(`??????????????????????????????????????? '${file.getFileName()}' ???????????????????????????????????????????`)
                    if (cover) {
                        fileNameIsExist.delete()
                        fileOldParentFile?.removeSubFile(file)
                        this.addSubFile(file)
                    }
                } else {
                    fileOldParentFile?.removeSubFile(file)
                    this.addSubFile(file)
                }
            }
            this.sortSubFiles()
        }
    }

    toFileConstructor = (): FileConstructor => {
        return {
            strId: this.getId(),
            boolIsDirectory: this.isDirectory(),
            strFileName: this.getFileName(),
            strData: this.getData(),
            strDataType: this.getDataType(),
            boolIsExpand: this.isExpand(),
            arrFileSubFiles: this.getSubFiles().map(file => file.toFileConstructor()),
        }
    }

    // isAbove = (objFile: File) => {
    //     const objFileRootFile = FileManager.getRootFile()
    //     let srcRootSubFile: File = this
    //     let destRootSubFile: File = objFile
    //     while (srcRootSubFile.getParent() !== objFileRootFile) {
    //         srcRootSubFile = srcRootSubFile.getParent()!
    //     }
    //     while (destRootSubFile.getParent() !== objFileRootFile){
    //         destRootSubFile = destRootSubFile.getParent()!
    //     }
    //     const sortedFiles = this.sortSubFiles([srcRootSubFile, destRootSubFile])
    //     return (sortedFiles[0] === srcRootSubFile)
    // }
}