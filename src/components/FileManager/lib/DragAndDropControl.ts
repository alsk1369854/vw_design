import File from "./File";
import FileManager from "./FileManager";
import FunctionCaller from "../../../tools/FunctionCaller";
import { FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT } from "../Content";

export default class DragAndDropControl {
    srcFile: File | undefined;
    destFile: File | undefined;
    itemType = {
        fileItem: 'fileItem'
    }

    getSrcFile = () => this.srcFile
    setSrcFile = (objFile: File) => this.srcFile = objFile

    getDestFile = () => this.destFile
    setDestFile = (objFile: File) => this.destFile = objFile

    setOnOverFile = (objFile: File) => {
        const destDirectoryFile = (objFile.isDirectory()) ? objFile : objFile.getParent()
        if (destDirectoryFile === this.destFile) return
        this.destFile = destDirectoryFile
        if (!destDirectoryFile?.isExpand()) {
            setTimeout(() => {
                if (this.destFile === destDirectoryFile) {
                    destDirectoryFile?.setIsExpand(true)
                    FunctionCaller.call(FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT)
                }
            }, 1000)
        }
        // FunctionCaller.call(FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT)
    }

    isSrcFileCanDrop = (objFile: File): boolean => {
        // console.log(this.srcFile)
        if (!this.srcFile) return false

        const destDirectoryFile = (objFile.isDirectory()) ? objFile : objFile.getParent()
        // console.log(destDirectoryFile)
        const arrFiles = (FileManager.selectedFileIsExists(this.srcFile)) ?
            FileManager.getSetSelectedFiles() :
            [this.srcFile]
        for (const file of arrFiles) {
            const fileParentFile = file.getParent()
            const fileDirectoryFile = (file.isDirectory()) ? file : file.getParent()
            // 同父底下, 自己本身, 是資料夾自己底下當按夾 不可
            if (fileParentFile === destDirectoryFile
                || fileDirectoryFile === destDirectoryFile
                || (file.isDirectory() && destDirectoryFile!.isSubFileOf(file))) {
                return false
            }
        }
        return true
    }

    action = () => {
        if (this.srcFile && this.destFile) {
            const arrFiles = (FileManager.selectedFileIsExists(this.srcFile)) ?
                FileManager.getSetSelectedFiles() :
                [this.srcFile]
            this.destFile.moveToThisFile(arrFiles)
            this.destFile.setIsExpand(true)
            // console.log(`@${this.srcFile?.getFileName()} move to ${this.destFile?.getFileName()}`)
        }
    }

    reset = () => {
        this.srcFile = undefined
        this.destFile = undefined
        // FunctionCaller.call(FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT)
    }
}