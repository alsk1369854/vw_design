import FileManager from "./FileManager";


export interface FileConstructor {
    strId: string,
    strFileName: string,
    numFileType: number,
    strData: string,
    boolIsExpand: boolean,
    arrFileSubFiles?: Array<FileConstructor>,
    objFileParent?: File | undefined,
    deep?: number
}


export default class File implements FileConstructor {
    strId: string = "";
    strFileName: string = "";
    arrStrFileExtension: Array<string> = [];
    numFileType: number = 0;
    strData: string = "";
    boolIsExpand: boolean = false;
    arrFileSubFiles: Array<File> = [];
    objFileParent!: File | undefined;

    constructor(fileData: FileConstructor) {
        this.strId = fileData.strId;
        this.strFileName = fileData.strFileName;
        this.numFileType = fileData.numFileType;
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
        const numFileType = objFileSuperFile.getFileType();
        let parentFile: File = this.getParent()!;
        if (parentFile && (numFileType === 1 || numFileType === 0)) {
            return (parentFile.getId() === objFileSuperFile.getId()) ?
                true : parentFile.isSubFileOf(objFileSuperFile)
        }
        return false
    }

    addSubFile = (objFile: File) => {
        if (this.numFileType === 0 || this.numFileType === 1) {
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
        // sort subfiles with filenames by ASC(遞增)
        this.arrFileSubFiles.sort((f1, f2) => f1.strFileName.localeCompare(f2.strFileName))
        // 相同字符，按長度排序
        this.arrFileSubFiles.sort((f1, f2) => {
            const s1 = f1.strFileName.charAt(0)
            const s2 = f2.strFileName.charAt(0)
            if (s1.toLocaleUpperCase() === s2.toLocaleUpperCase()) {
                const temp = f1.strFileName.length - f2.strFileName.length
                return (temp != 0) ? temp : f1.strFileName.localeCompare(f2.strFileName)
            }
            return 0;
        })
    }

    private buildFileExtension = () => {
        let arrStrFileExtensionData = this.strFileName.split('.')
        if (arrStrFileExtensionData.length > 1) {
            this.arrStrFileExtension = arrStrFileExtensionData.slice(1)
        } else {
            this.arrStrFileExtension = []
        }
    }
    getFileExtension = () => this.arrStrFileExtension

    getId = () => this.strId
    setId = (strNewId: string) => this.strId = strNewId

    getFileType = () => this.numFileType
    setFileType = (numNewFileType: number) => this.numFileType = numNewFileType

    getIsExpand = () => this.boolIsExpand
    setIsExpand = (boolIsExpandState: boolean) => this.boolIsExpand = boolIsExpandState

    getData = () => this.strData
    setData = (strNewData: string) => this.strData = strNewData

    getFileName = () => this.strFileName
    setFileName = (strNewFileName: string) => {
        this.strFileName = strNewFileName
        if (!(this.getFileType() === 1 || this.getFileType() === 0)) {
            this.buildFileExtension()
            const arrStrFileExtensionData = this.getFileExtension()
            if (arrStrFileExtensionData.length === 0) {
                this.setFileType(FileManager.getFileType('unknown'))
            } else {
                this.setFileType(FileManager.getFileType(arrStrFileExtensionData[0]))
            }
        }
        this.getParent()?.sortSubFiles()
    }

    getSubFiles = () => this.arrFileSubFiles
    setSubFiles = (arrFileNewSubFiles: Array<File>) => this.arrFileSubFiles = arrFileNewSubFiles

    getParent = () => this.objFileParent
    setParent = (objFileNewParent: File) => {
        if (objFileNewParent.numFileType === 1 || objFileNewParent.numFileType === 0) {
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

}