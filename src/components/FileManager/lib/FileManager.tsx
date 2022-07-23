import React, { Component } from 'react'

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


import FunctionCaller from '../../../tools/FunctionCaller'
import {
  FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_BAR,
  FUNCTION_CALLER_KEY_GET_OPEN_FILE_ITEMS,
  FUNCTION_CALLER_KEY_SET_OPEN_FILE_ITEMS,
} from '../../MainFrame/EditArea/OpenedFileBar'
import File, { FileConstructor } from './File'
import style from '../index.module.scss'


export class FileManager {
  strId: string = "";
  objFileRootFile!: File;
  objMapFileMap: Map<string, File> = new Map()
  static objMapFileIconMap: Map<number, JSX.Element> = new Map();
  static objMapFileTypeMap: Map<string, number> = new Map();
  objMapSelectedFiles: Map<string, File> = new Map();
  arrFileOpenFiles: Array<File> = [];

  constructor() { }

  getNextId = () => nanoid();

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
    this.arrFileOpenFiles = this.arrFileOpenFiles.filter((file: File) => file.getId() !== fileId)
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
    return (numFileType) ? numFileType : -1
  }

  getFileById = (strId: string) => this.objMapFileMap.get(strId)

  getRootFile = () => this.objFileRootFile

  setRootFile = (objFileRootFile: FileConstructor) => {
    this.objMapFileMap = new Map()
    this.objFileRootFile = new File(objFileRootFile)
    // console.log(this.objMapFileMap)
  }

  downloadSeletedFiles = () => {
    const arrFilePrepareDownloadFiles: Array<File> = this.getSetSelectedFiles();
    if (arrFilePrepareDownloadFiles.length > 1) {
      this.downloadFiles(arrFilePrepareDownloadFiles)
    } else {
      this.downloadFile(arrFilePrepareDownloadFiles[0])
    }
  }

  downloadFile = (objFile: File) => {
    switch (objFile.getFileType()) {
      case 0: // vw_project
        this.downloadFiles(this.objFileRootFile.getSubFiles())
        break
      case 1: // directory
        this.downloadFiles([objFile])
        break
      case 6: // image
        FileManager.downloadImageFile(objFile.getFileName(), objFile.getData())
        break
      default: // txt
        FileManager.downloadTextFile(objFile.getFileName(), objFile.getData())
        break
    }
  }
  downloadFiles = (arrFileFiles: Array<File>) => {
    const addFileToJsZipFolder = (objJSZipFolder: any, objFile: File) => {
      switch (objFile.getFileType()) {
        case 1: // directory
          const subFolder = objJSZipFolder.folder(objFile.getFileName())
          objFile.getSubFiles().forEach(file => addFileToJsZipFolder(subFolder, file))
          break
        case 6: // image file
          objJSZipFolder.file(objFile.getFileName(), objFile.getData(), { base64: true });
          break
        default: // text file
          objJSZipFolder.file(objFile.getFileName(), objFile.getData())
          break
      }
    }
    var zip: any = new JSZip();
    arrFileFiles.forEach(file => addFileToJsZipFolder(zip, file))

    zip.generateAsync({ type: "blob" })
      .then((content: any) => {
        saveAs(content, `${this.objFileRootFile.getFileName()}.zip`);
      });
  }



  static downloadTextFile = (strFilename: any, strText: any) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(strText));
    element.setAttribute('download', strFilename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  static downloadImageFile = (strFilename: any, strBas64: any) => {
    var element = document.createElement('a');
    // element.setAttribute('href', 'data:image/png;base64,' + strBas64);
    element.setAttribute('href', 'data:image/png;base64,' + strBas64);
    element.setAttribute('download', strFilename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  getSetSelectedFiles = () => {
    const objFileDirectoryFiles = this.getSelectedFiles().filter(file => file.getFileType() === 1)
    let arrFileSetSelectedFiles = this.getSelectedFiles().filter(file => {
      for (const objFileDirFile of objFileDirectoryFiles) {
        if (file.isSubFileOf(objFileDirFile)) return false
      }
      return true
    })
    return arrFileSetSelectedFiles
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
FileManager.objMapFileTypeMap.set('vw', 0)  // vs_project
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
const objFileManager = new FileManager()
export default objFileManager;




const fileListRoot = {
  strId: "root",
  strFileName: "project_1",
  numFileType: 0,
  strData: "",
  boolIsExpand: true,
  arrFileSubFiles: [
    {
      strId: "1-1",
      strFileName: "file1.txt",
      numFileType: 2,
      strData: "file1",
      boolIsExpand: false,
      arrFileSubFiles: []
    },
    {
      strId: "1-2",
      strFileName: "dir2",
      numFileType: 1,
      strData: "",
      boolIsExpand: true,
      // boolIsExpand: false,
      arrFileSubFiles: [
        {
          strId: "1-2-1",
          strFileName: "html.html",
          numFileType: 3,
          strData: '<!DOCTYPE html><html lang="en"><body><h1>Hello World!</h1></body></html>',
          boolIsExpand: false,
          arrFileSubFiles: []
        },
        {
          strId: "1-2-2",
          strFileName: "style.css",
          numFileType: 4,
          strData: "body {background-color: rgb(255,0,0)}",
          boolIsExpand: false,
          arrFileSubFiles: []
        },
        {
          strId: "1-2-3",
          strFileName: "dir2-3",
          numFileType: 1,
          strData: "",
          boolIsExpand: true,
          // boolIsExpand: false,
          arrFileSubFiles: [
            {
              strId: "1-2-3-1",
              strFileName: "file2-3-1.tx",
              // numFileType: 2,
              numFileType: -1,
              strData: "file2-3-1",
              boolIsExpand: false,
              arrFileSubFiles: []
            },
          ]
        },
        {
          strId: "1-2-4",
          strFileName: "javascript.js",
          numFileType: 5,
          strData: "console.log('Hello World!')",
          boolIsExpand: false,
          arrFileSubFiles: []
        },
      ]
    },
    {
      strId: "3",
      strFileName: "img.png",
      numFileType: 6,
      // strData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
      strData: "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
      boolIsExpand: false,
      arrFileSubFiles: []
    },
  ]
}
objFileManager.setRootFile(fileListRoot)


