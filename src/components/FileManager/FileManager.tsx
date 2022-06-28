import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFolderOpen, // directory
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


import File, { FileConstructor } from './File'
import style from './index.module.scss'

export const objMapFileIconMap: Map<number, JSX.Element> = new Map();
objMapFileIconMap.set(-1, // unset
  <FontAwesomeIcon icon={faFile} className={style.fileIcon}  />)
objMapFileIconMap.set(1, // directory
  <FontAwesomeIcon icon={faFolderOpen} className={style.fileIcon} style={{ color: "rgb(192,149,83)" }}  />)
objMapFileIconMap.set(2, // .txt
  <FontAwesomeIcon icon={faFileLines} className={style.fileIcon} style={{ color: "rgb(118,140,172)" }} />)
objMapFileIconMap.set(3, // .html
  <FontAwesomeIcon icon={faHtml5} className={style.fileIcon} style={{ color: "rgb(241,101,42)"}} />)
objMapFileIconMap.set(4, // .css
  <FontAwesomeIcon icon={faCss3Alt} className={style.fileIcon} style={{ color: "rgb(50,167,219)" }} />)
objMapFileIconMap.set(5, // .js
  <FontAwesomeIcon icon={faJsSquare} className={style.fileIcon} style={{ color: "rgb(245,222,25)" }} />)
objMapFileIconMap.set(6, // .jpg/.jpeg/.png
  <FontAwesomeIcon icon={faImage} className={style.fileIcon} style={{ color: "rgb(45,204,159)" }} />)

class FileManager {
  strId: string = "";
  objFileRootFile!: FileConstructor;
  objMapFileMap: Map<string, FileConstructor> = new Map()

  constructor() { }

  getRootFile = () => this.objFileRootFile

  setRootFile = (objFileRootFile: FileConstructor) => {
    this.objMapFileMap = new Map();
    this.objFileRootFile = new File(objFileRootFile)
    // console.log(this.objMapFileMap)
  }

  getFileMap = () => {
    return this.objMapFileMap
  }
}
export default new FileManager();

