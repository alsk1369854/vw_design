import FileManager from "./FileManager";


export interface FileConstructor {
    strId: string,
    strFileName: string,
    numFileType: number,
    strData: string,
    boolIsExpand: boolean,
    arrFileSubFiles: Array<FileConstructor>,
    objFileParent?: File|undefined,
    deep?: number
}


export default class File implements FileConstructor {
    strId: string = "";
    strFileName: string = "";
    numFileType: number = 0;
    strData: string = "";
    boolIsExpand: boolean = false;
    arrFileSubFiles: Array<File> = [];
    objFileParent!: File|undefined;
    arrStrFileExtension: Array<String> = [];

    constructor(fileData?: FileConstructor) {
        if (fileData != undefined) {
            this.strId = fileData.strId;
            this.strFileName = fileData.strFileName;
            this.numFileType = fileData.numFileType;
            this.strData = fileData.strData;
            this.boolIsExpand = fileData.boolIsExpand;
            this.buildFileExtension()
            this.arrFileSubFiles = fileData.arrFileSubFiles.map((item: FileConstructor) => {
                item.objFileParent = this;
                return new File(item);
            })
            this.sortSubFiles()

            if (fileData.objFileParent) this.setParent(fileData.objFileParent)

            FileManager.getFileMap().set(fileData.strId, this)
        } else {
            console.log("fileData is undefined")
        }
    }

    buildFileExtension = () => {
        let arrStrFileExtensionData = this.strFileName.split('.')
        if (arrStrFileExtensionData.length > 1) {
            this.arrStrFileExtension = arrStrFileExtensionData.slice(1)
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

    getFileExtension = () => this.arrStrFileExtension

    getId = () => this.strId

    getFileType = () => this.numFileType

    getIsExpand = () => this.boolIsExpand

    getData = () => this.strData

    setData = (strNewData: string) => {
        this.strData = strNewData
    }

    getFileName = () => this.strFileName

    setFileName = (strNewFileName: string) => {
        this.strFileName = strNewFileName
    }

    listFiles = () => this.arrFileSubFiles

    getParent = () => this.objFileParent
    setParent = (objFileNewParent: File) => {
        if(objFileNewParent.numFileType === 1){
            this.objFileParent = objFileNewParent
        }
    }

    getPath = () => {
        let filePath = '/' + this.getFileName();
        let fileParent = this.objFileParent
        while(fileParent?.getFileName().toUpperCase() !== 'ROOT'){
            filePath = '/' + fileParent?.getFileName() + filePath
            fileParent = fileParent?.objFileParent!
        }
        return filePath
    }

}