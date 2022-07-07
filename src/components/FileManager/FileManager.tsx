import React, { Component } from 'react'
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


import FunctionCaller from '../../tools/FunctionCaller'
import {
  FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_BAR,
  FUNCTION_CALLER_KEY_GET_OPEN_FILE_ITEMS,
  FUNCTION_CALLER_KEY_SET_OPEN_FILE_ITEMS,
} from '../MainFrame/EditArea/OpenedFileBar'
import File, { FileConstructor } from './File'
import style from './index.module.scss'


class FileManager {
  strId: string = "";
  objFileRootFile!: File;
  objMapFileMap: Map<string, File> = new Map()
  static objMapFileIconMap: Map<number, JSX.Element> = new Map();
  static objMapFileTypeMap: Map<string, number> = new Map();
  objMapSelectedFiles: Map<string, File> = new Map();
  arrFileOpenFiles: Array<File> = [];

  constructor() { }

  getOpenFiles = () => this.arrFileOpenFiles

  setOpenFiles = (arrFileOpenFiles: Array<File>) => {
    this.arrFileOpenFiles = arrFileOpenFiles
  }

  addOpenFile = (objFile: FileConstructor) => {
    if (objFile.numFileType == 1) return
    const file = this.objMapFileMap.get(objFile.strId)
    if (file && !this.openFileIsExists(file)) {
      this.arrFileOpenFiles.push(file)
      FunctionCaller.call(FUNCTION_CALLER_KEY_SET_OPEN_FILE_ITEMS, [this.arrFileOpenFiles])
    }
  }

  deleteOpenFile = (objFile: FileConstructor) => {
    const fileId = objFile.strId
    this.arrFileOpenFiles = this.arrFileOpenFiles.filter( (file:File) => file.getId() !== fileId)
    FunctionCaller.call(FUNCTION_CALLER_KEY_SET_OPEN_FILE_ITEMS, [this.arrFileOpenFiles])
  }

  cleanOpenFiles = () => {
    this.arrFileOpenFiles = []
    FunctionCaller.call(FUNCTION_CALLER_KEY_SET_OPEN_FILE_ITEMS, [this.arrFileOpenFiles])
  }

  openFileIsExists = (objFile: FileConstructor): boolean => {
    const file = this.objMapFileMap.get(objFile.strId)
    if (file) {
      const fileIndex = this.arrFileOpenFiles.indexOf(file)
      return (fileIndex === -1) ? false : true
    }
    return false
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

  addSelectedFile = (objFile: FileConstructor) => {
    const fileId = objFile.strId
    const file = this.objMapFileMap.get(fileId)
    if (file) this.objMapSelectedFiles.set(fileId, file)
  }

  deleteSelectedFile = (objFile: FileConstructor) => {
    const fileId = objFile.strId
    const file = this.objMapFileMap.get(fileId)
    if (file) this.objMapSelectedFiles.delete(fileId)
  }

  cleanSelectedFiles = () => this.objMapSelectedFiles.clear()

  selectedFileIsExists = (objFile: FileConstructor): boolean => this.objMapSelectedFiles.has(objFile.strId)

  getFileMap = () => this.objMapFileMap

  getFileIcon = (objFileFile: FileConstructor) => {
    if (objFileFile.numFileType === 1) {
      return (objFileFile.boolIsExpand) ?
        FileManager.objMapFileIconMap.get(1.2) :
        FileManager.objMapFileIconMap.get(1.1)
    }
    return FileManager.objMapFileIconMap.get(objFileFile.numFileType)
  }

  getFileType = (strFileExtension: string) => {
    const numFileType = FileManager.objMapFileTypeMap.get(strFileExtension)
    return (numFileType)? numFileType : -1
  }

  getFileById = (strId: string) => this.objMapFileMap.get(strId)

  getRootFile = () => this.objFileRootFile

  setRootFile = (objFileRootFile: FileConstructor) => {
    this.objMapFileMap = new Map()
    this.objFileRootFile = new File(objFileRootFile)
    // console.log(this.objMapFileMap)
  }

  downloadSeletedFiles = () => {
    this.getSelectedFiles().forEach(file => this.downloadFile(file))
  }

  downloadFile = (objFile: File) => {
    switch(objFile.getFileType()){
      case 0: // vs_project
         break
      case 1: // directory
        break
      case 6: // image
        FileManager.downloadImageFile(objFile.getFileName(), objFile.getData())
        break
      default: // txt
        FileManager.downloadTextFile(objFile.getFileName(), objFile.getData())
        break
    }
  }
  

  static downloadTextFile = (strFilename:any, strText:any) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(strText));
    element.setAttribute('download', strFilename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  static downloadImageFile = (strFilename:any, strBas64:any) => {
    var element = document.createElement('a');
    // element.setAttribute('href', 'data:image/png;base64,' + strBas64);
    element.setAttribute('href', strBas64);
    element.setAttribute('download', strFilename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}
// START setting FileIconMap ============================================
FileManager.objMapFileIconMap.set(-1, // unknown
  <FontAwesomeIcon icon={faFile} className={style.fileIcon} />)
FileManager.objMapFileIconMap.set(1.1, // directory close
  <FontAwesomeIcon icon={faFolder} className={style.fileIcon} style={{ color: "rgb(192,149,83)", width: '13px', height: '13px', marginTop: '1px', marginBottom: '1px' }} />)
FileManager.objMapFileIconMap.set(1.2, // directory open
  <FontAwesomeIcon icon={faFolderOpen} className={style.fileIcon} style={{ color: "rgb(220,182,122)" }} />)
FileManager.objMapFileIconMap.set(2, // .txt
  <FontAwesomeIcon icon={faFileLines} className={style.fileIcon} style={{ color: "rgb(118,140,172)" }} />)
FileManager.objMapFileIconMap.set(3, // .html
  <FontAwesomeIcon icon={faHtml5} className={style.fileIcon} style={{ color: "rgb(241,101,42)" }} />)
FileManager.objMapFileIconMap.set(4, // .css
  <FontAwesomeIcon icon={faCss3Alt} className={style.fileIcon} style={{ color: "rgb(50,167,219)" }} />)
FileManager.objMapFileIconMap.set(5, // .js
  <FontAwesomeIcon icon={faJsSquare} className={style.fileIcon} style={{ color: "rgb(245,222,25)" }} />)
FileManager.objMapFileIconMap.set(6, // .jpg/.jpeg/.png
  <FontAwesomeIcon icon={faImage} className={style.fileIcon} style={{ color: "rgb(45,204,159)" }} />)
// END setting FileIconMap ============================================


// START setting FileTypeMap ============================================
FileManager.objMapFileTypeMap.set('unknown', -1)    // unknown
FileManager.objMapFileTypeMap.set('vs_project', 0)  // vs_project
FileManager.objMapFileTypeMap.set('directory', 1)   // directory
FileManager.objMapFileTypeMap.set('txt', 2)         // txt
FileManager.objMapFileTypeMap.set('html', 3)        // html
FileManager.objMapFileTypeMap.set('htm', 3) 
FileManager.objMapFileTypeMap.set('css', 4)         // css
FileManager.objMapFileTypeMap.set('js', 5)          // js
FileManager.objMapFileTypeMap.set('jpg', 6)         // image
FileManager.objMapFileTypeMap.set('jpeg', 6) 
FileManager.objMapFileTypeMap.set('png', 6) 
// END setting FileTypeMap ============================================

export default new FileManager();

