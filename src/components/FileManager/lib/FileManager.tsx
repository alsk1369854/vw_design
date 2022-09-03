import { nanoid } from 'nanoid';
import JSZip from 'jszip'
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFolderOpen, // directory open
  faFolder, // directory close
  faImage, // .png
} from '@fortawesome/free-solid-svg-icons'
import {
  faHtml5, //.html
  faCss3Alt, // .css
  faJsSquare, // .js
} from '@fortawesome/free-brands-svg-icons'
import {
  faFile, // unset
  faFileLines, // .txt
} from '@fortawesome/free-regular-svg-icons'


import FileItemStyle from '../Content/FileItem/index.module.scss'
import { FileManagerDownloadDataTypeMismatchError } from '../../../tools/Error';
import FunctionCaller from '../../../tools/FunctionCaller'
import {
  // FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS,
  // FUNCTION_CALLER_KEY_GET_OPEN_FILE_ITEMS,
  FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS,
} from '../../MainFrame/EditArea/OpenedFileBar'
import File, { FileConstructor } from './File'

const fileIconElement = {
  directoryIsExpand: <FontAwesomeIcon icon={faFolderOpen} className={FileItemStyle.fileIcon} style={{ color: "rgb(220,182,122)" }} />,
  directoryNotExpand: <FontAwesomeIcon icon={faFolder} className={FileItemStyle.fileIcon} style={{ color: "rgb(192,149,83)", width: '13px', height: '13px', marginTop: '1px', marginBottom: '1px' }} />,

  unknown: <FontAwesomeIcon icon={faFile} className={FileItemStyle.fileIcon} />,
  txt: <FontAwesomeIcon icon={faFileLines} className={FileItemStyle.fileIcon} style={{ color: "rgb(118,140,172)" }} />,
  html: <FontAwesomeIcon icon={faHtml5} className={FileItemStyle.fileIcon} style={{ color: "rgb(241,101,42)" }} />,
  css: <FontAwesomeIcon icon={faCss3Alt} className={FileItemStyle.fileIcon} style={{ color: "rgb(50,167,219)" }} />,
  js: <FontAwesomeIcon icon={faJsSquare} className={FileItemStyle.fileIcon} style={{ color: "rgb(245,222,25)" }} />,
  image: <FontAwesomeIcon icon={faImage} className={FileItemStyle.fileIcon} style={{ color: "rgb(45,204,159)" }} />,
}


export class FileManager {
  // strId: string = "";
  objFileRootFile!: File;
  objMapFileMap: Map<string, File> = new Map()
  static objMapFileIconMap: Map<string, JSX.Element> = new Map();
  static objMapFileTypeMap: Map<string, number> = new Map();
  objMapSelectedFiles: Map<string, File> = new Map();
  arrFileOpenFiles: Array<File> = [];

  getNextId = () => nanoid();

  closeAllExpandDirectory = () => {
    const closeExpandDirectory = (objFile: File) => {
      if (objFile.isDirectory()) {
        objFile.getSubFiles().forEach(file => closeExpandDirectory(file))
        objFile.setIsExpand(false)
      }
    }
    this.getRootFile().getSubFiles().forEach(file => closeExpandDirectory(file))
  }

  getOpenFiles = () => this.arrFileOpenFiles
  updateOpenFiles = (arrFileOpenFiles: Array<File>) => {
    this.arrFileOpenFiles = arrFileOpenFiles
    FunctionCaller.call(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS, this.arrFileOpenFiles)
  }
  setOpenFiles = (arrFileOpenFiles: Array<File>) => this.arrFileOpenFiles = arrFileOpenFiles

  addOpenFile = (objFile: File) => {
    if (objFile.isDirectory()) return
    if (!this.openFileIsExists(objFile)) {
      this.arrFileOpenFiles.push(objFile)
      FunctionCaller.call(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS, this.arrFileOpenFiles)
    }
  }
  addOpenFileSeletedFiles = () => {
    const arrFile = this.getSelectedFiles()
    arrFile.forEach(file => this.addOpenFile(file))
  }
  deleteOpenFile = (objFile: File) => {
    this.arrFileOpenFiles = this.arrFileOpenFiles.filter((file: File) => file !== objFile)
    FunctionCaller.call(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS, this.arrFileOpenFiles)
  }
  cleanOpenFiles = () => {
    this.arrFileOpenFiles = []
    FunctionCaller.call(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS, this.arrFileOpenFiles)
  }
  openFileIsExists = (objFile: File): boolean => {
    const fileIndex = this.arrFileOpenFiles.indexOf(objFile)
    return (fileIndex === -1) ? false : true
  }

  getSelectedFiles = () => {
    let selectedFiles = []
    let iterator = this.objMapSelectedFiles.values()
    let result = iterator.next()
    while (!result.done) {
      selectedFiles.push(result.value)
      result = iterator.next()
    }
    return selectedFiles
  }
  addSelectedFile = (objFile: File) => this.objMapSelectedFiles.set(objFile.getId(), objFile)
  deleteSelectedFile = (objFile: File) => this.objMapSelectedFiles.delete(objFile.getId())
  cleanSelectedFiles = () => this.objMapSelectedFiles.clear()
  selectedFileIsExists = (objFile: File): boolean => this.objMapSelectedFiles.has(objFile.getId())
  getSetSelectedFiles = () => {
    const objFileDirectoryFiles = this.getSelectedFiles().filter(file => file.isDirectory())
    const arrFileSetSelectedFiles = this.getSelectedFiles().filter(file => {
      for (const objFileDirFile of objFileDirectoryFiles) {
        if (file.isSubFileOf(objFileDirFile)) return false
      }
      return true
    })
    return arrFileSetSelectedFiles
  }

  getFileMap = () => this.objMapFileMap

  getFileIcon = (objFile: File, strTemporaryFileName?: string) => {
    if (objFile.isDirectory()) {
      return (objFile.isExpand()) ?
        FileManager.objMapFileIconMap.get('directoryIsExpand') :
        FileManager.objMapFileIconMap.get('directoryNotExpand')
    } else {
      const arrStrFileExtension = (strTemporaryFileName || strTemporaryFileName?.length === 0) ?
        File.getFileNameExtensionStrArray(strTemporaryFileName) :
        objFile.getFileExtension()

      const fileIconElement = FileManager.objMapFileIconMap.get(arrStrFileExtension[arrStrFileExtension.length - 1])
      return (fileIconElement) ?
        fileIconElement :
        FileManager.objMapFileIconMap.get('unknown')
    }
  }

  // getFileType = (strFileExtension: string) => {
  //   const numFileType = FileManager.objMapFileTypeMap.get(strFileExtension)
  //   return (numFileType) ? numFileType : -1
  // }

  getFileById = (strId: string) => this.objMapFileMap.get(strId)
  getFileByPath = (strFilePath: string) => this.getRootFile().getFileByPath(strFilePath)

  getRootFile = () => this.objFileRootFile
  setRootFile = (objFileRootFile: FileConstructor) => {
    this.objMapFileMap = new Map()
    this.objMapSelectedFiles = new Map()
    this.arrFileOpenFiles = []
    this.objFileRootFile = new File(objFileRootFile)
  }

  downloadFile = (objFile: File) => {
    switch (objFile.getDataType()) {
      case 'directory': // directory
        this.downloadFiles([objFile])
        break
      case 'image': // image file
        FileManager.downloadImageFile(objFile.getFileName(), objFile.getData())
        break
      case 'text': // text file
        FileManager.downloadTextFile(objFile.getFileName(), objFile.getData())
        break
      default: // data type mismatch
        throw new FileManagerDownloadDataTypeMismatchError(`File ${objFile.getFileName()} Data Type Mismatch`)
    }
  }
  downloadFiles = (arrFileFiles: Array<File>) => {
    const addFileToJsZipFolder = (objJSZipFolder: any, objFile: File) => {
      switch (objFile.getDataType()) {
        case 'directory': // directory
          const subFolder = objJSZipFolder.folder(objFile.getFileName())
          objFile.getSubFiles().forEach(file => addFileToJsZipFolder(subFolder, file))
          break
        case 'image': // image file
          objJSZipFolder.file(objFile.getFileName(), objFile.getData(), { base64: true });
          break
        case 'text': // text file
          objJSZipFolder.file(objFile.getFileName(), objFile.getData())
          break
        default: // data type mismatch
          throw new FileManagerDownloadDataTypeMismatchError(`File ${objFile.getFileName()} Data Type Mismatch`)
      }
    }
    var zip: any = new JSZip();
    arrFileFiles.forEach(file => addFileToJsZipFolder(zip, file))

    zip.generateAsync({ type: "blob" })
      .then((content: any) => {
        saveAs(content, `${this.objFileRootFile.getFileName()}.zip`);
      });
  }
  downloadSeletedFiles = () => {
    const arrFile: Array<File> = this.getSetSelectedFiles();
    if (arrFile.length > 1) {
      this.downloadFiles(arrFile)
    } else {
      this.downloadFile(arrFile[0])
    }
  }

  static downloadTextFile = (strFileName: string, strText: string) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(strText));
    element.setAttribute('download', strFileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  static downloadImageFile = (strFileName: string, strBas64: string) => {
    var element = document.createElement('a');
    // element.setAttribute('href', 'data:image/png;base64,' + strBas64);
    element.setAttribute('href', 'data:image/png;base64,' + strBas64);
    element.setAttribute('download', strFileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

// START setting FileIconMap ============================================
// directory open and close
FileManager.objMapFileIconMap.set('directoryIsExpand', fileIconElement.directoryIsExpand)
FileManager.objMapFileIconMap.set('directoryNotExpand', fileIconElement.directoryNotExpand)

// file type unknown
FileManager.objMapFileIconMap.set('unknown', fileIconElement.unknown)
// .txt
FileManager.objMapFileIconMap.set('txt', fileIconElement.txt)
// .html/htm
FileManager.objMapFileIconMap.set('html', fileIconElement.html)
FileManager.objMapFileIconMap.set('htm', fileIconElement.html)
// .css
FileManager.objMapFileIconMap.set('css', fileIconElement.css)
// .js
FileManager.objMapFileIconMap.set('js', fileIconElement.js)
// .jpg/.jpeg/.png
FileManager.objMapFileIconMap.set('jpg', fileIconElement.image)
FileManager.objMapFileIconMap.set('jpeg', fileIconElement.image)
FileManager.objMapFileIconMap.set('png', fileIconElement.image)
// END setting FileIconMap ============================================


// // START setting FileTypeMap ============================================
// FileManager.objMapFileTypeMap.set('unknown', -1)    // unknown
// FileManager.objMapFileTypeMap.set('vw', 0)  // vs_project
// FileManager.objMapFileTypeMap.set('directory', 1)   // directory
// FileManager.objMapFileTypeMap.set('txt', 2)         // txt
// FileManager.objMapFileTypeMap.set('html', 3)        // html
// FileManager.objMapFileTypeMap.set('htm', 3)
// FileManager.objMapFileTypeMap.set('css', 4)         // css
// FileManager.objMapFileTypeMap.set('js', 5)          // js
// FileManager.objMapFileTypeMap.set('jpg', 6)         // image
// FileManager.objMapFileTypeMap.set('jpeg', 6)
// FileManager.objMapFileTypeMap.set('png', 6)
// // END setting FileTypeMap ============================================

const objFileManger = new FileManager();
export default objFileManger

const DEFAULT_ROOT_FILE = {
  strId: "default_rootFile_cannot_edit",
  boolIsDirectory: true,
  strFileName: "root",
  strData: "",
  strDataType: "directory",
  boolIsExpand: true,
  arrFileSubFiles: []
}
objFileManger.setRootFile(DEFAULT_ROOT_FILE)



// let destFile = objFileManager.getRootFile().getFileByPath('dir2/html.html')
// console.log('@1',destFile)

// destFile = objFileManager.getFileById('1-2-1')?.getFileByPath('./..//')!
// console.log('@2',destFile)

// destFile = objFileManager.getFileById('1-2-1')?.getFileByPath('./tt.tt')!
// console.log('@3',destFile)