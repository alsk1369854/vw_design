import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleRight,
  faAngleDown,
  faSquareFull
} from '@fortawesome/free-solid-svg-icons'

import style from './index.module.scss'
// import File from './File_temp'
import File, { FileConstructor } from './File'
import FileManager from './FileManager'
import { Divider } from '../ToolBar'
import ContextMenu from './ContextMenu'


const fileListRoot = {
  strId: "root",
  strFileName: "root",
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
      strData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
      boolIsExpand: false,
      arrFileSubFiles: []
    },
  ]
}


// new File();
// console.log("F".localeCompare("f"))
// console.log("file1.txt".localeCompare("File3.txt", 'en', { sensitivity: 'variant' }))
// console.log("abc".localeCompare("Abc", 'en', { sensitivity: 'base' }));

// const fileList: any[] = [];
// const buildFileList = (fileListNode: any, deep: number) => {
//   const temp = { ...fileListNode, deep }
//   fileList.push(temp)
//   if (fileListNode.numFileType === 1 && fileListNode.boolIsExpand) {
//     fileListNode.arrFileSubFiles.forEach((item: any) => buildFileList(item, deep + 1))
//   }
// }
// // fileListRoot.arrFileSubFiles.forEach(item => buildFileList(item, 0))
// FileManager.setRootFile(fileListRoot)
// FileManager.getRootFile().arrFileSubFiles.forEach(item => buildFileList(item, 0))

// console.log(fileList);

FileManager.setRootFile(fileListRoot)

const test = [
  <span className={style.expandLine}>&nbsp;</span>,
  <span className={style.expandLine}>&nbsp;</span>
]
let test2: JSX.Element[] = []
for (let i = 0; i < 2; i++) {
  test2.push(<span className={style.expandLine}>&nbsp;</span>)
}
export default class FileManagerView extends Component {
  state = {
    showContextMenu: false,
    mouseDownXY: { x: 0, y: 0 },
    showContextMenuItem: FileManager.getRootFile(),
    renameItem: FileManager.getRootFile()
    // onClickItem: FileManager.getRootFile(),
  }
  componentDidMount() {
    document.addEventListener('click', () => {
      FileManager.cleanSelectedFiles()
      this.setState({
        showContextMenu: false,
        showContextMenuItem: FileManager.getRootFile(),
        renameItem: FileManager.getRootFile(),
      })
    });
    // this.setState({showContextMenuItem: FileManager.getRootFile()})
  }

  getFileList = () => {
    const fileList: FileConstructor[] = [];
    const buildFileList = (objFile: FileConstructor, deep: number) => {
      const temp = { ...objFile, deep }
      fileList.push(temp)
      if (objFile.numFileType === 1 && objFile.boolIsExpand) {
        objFile.arrFileSubFiles.forEach((file: FileConstructor) => buildFileList(file, deep + 1))
      }
    }
    FileManager.getRootFile().arrFileSubFiles.forEach(file => buildFileList(file, 0))
    return fileList
  }

  clickItem = (event: any, objFile: FileConstructor) => {
    event.stopPropagation()
    // event.preventDefault()
    // console.log(event)
    this.addToSelectedFiles(event, objFile)

    this.setState({ 
      showContextMenuItem: objFile,
      renameItem: FileManager.getRootFile(),
    })
  }
  doubleClickItem = (event: any, objFile: FileConstructor) => {
    if (objFile.numFileType != 1) {
      FileManager.addOpenFile(objFile)
    }
    console.log(FileManager.getOpenFiles())
  }

  showItemContextMenu = (event: any, objFile: FileConstructor) => {
    event.stopPropagation()
    event.preventDefault()
    console.log(event)
    this.setState({
      showContextMenu: true,
      mouseDownXY: { x: event.pageX, y: event.pageY },
      showContextMenuItem: objFile,
    })
  }

  getExpandLine = (strFileId: string, numFileDeep: number) => {
    let expandLine: JSX.Element[] = []
    for (let i = 0; i < numFileDeep; i++) expandLine.push(<span key={strFileId + "_ExpandLine_" + i} className={style.expandLine}>&nbsp;</span>)
    return expandLine
  }

  addToSelectedFiles = (event: any, objFile: FileConstructor) => {
    if (event.ctrlKey || event.metaKey) {
      if (FileManager.selectedFileIsExists(objFile)) {
        FileManager.deleteSelectedFile(objFile)
      } else {
        FileManager.addSelectedFile(objFile)
      }
    } else {
      FileManager.cleanSelectedFiles()
      FileManager.addSelectedFile(objFile)
      this.setFileIsExpand(event, objFile)
    }
  }

  setFileIsExpand = (event: any, objFile: FileConstructor) => {
    const file = FileManager.getFileById(objFile.strId)
    if (file && file.numFileType == 1) {
      file.boolIsExpand = !file.boolIsExpand
    }
  }

  renameCommit = (event:any, objFile: FileConstructor) => {
    if(event.key === "Enter"){
      const file = FileManager.getFileById(objFile.strId)
      if(file) file.setFileName(event.target.value)
    }
    //
  }

  render() {
    // console.log(objMapFileIconMap.get("1"))
    return (
      <div className={style.body} onClick={() => this.setState({ showContextMenu: false })}>
        {this.state.showContextMenu ? <ContextMenu parentThis={this} file={this.state.showContextMenuItem} x={this.state.mouseDownXY.x} y={this.state.mouseDownXY.y} /> : <></>}
        {this.getFileList().map(item => {
          return <div
            key={item.strId}
            className={style.fileItem}
            onClick={(event) => this.clickItem(event, item)}
            onDoubleClick={(event) => this.doubleClickItem(event, item)}
            onContextMenu={(event) => this.showItemContextMenu(event, item)}
            style={
              // (this.state.onClickItem.strId === item.strId) ?
              (FileManager.selectedFileIsExists(item)) ?
                (this.state.showContextMenuItem.strId === item.strId) ?
                  { borderStyle: 'solid', borderColor: 'rgb(0,127,212)', marginLeft: '-1.5px', backgroundColor: 'rgb(9,71,113)' } :
                  { backgroundColor: 'rgb(9,71,113)' } :
                (this.state.showContextMenuItem.strId === item.strId) ?
                  { borderStyle: 'solid', borderColor: 'rgb(0,127,212)', marginLeft: '-1.5px' } :
                  {}
            }
          >
            {this.getExpandLine(item.strId, item.deep!)}

            <span className={style.angleIcon}>
              {(item.numFileType == 1) ? (item.boolIsExpand) ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} /> :
                <FontAwesomeIcon icon={faSquareFull} className={style.isFileAngleIconBackground} />}
            </span>

            {FileManager.getFileIcon(item)}

            {(this.state.renameItem.strId === item.strId) ?
              <input autoFocus defaultValue={item.strFileName} onClick={(event)=> event.stopPropagation()} onKeyDown={(event => this.renameCommit(event, item))}/> :
              <span>{item.strFileName}</span>
            }

          </div>
        })}
      </div>
    )
  }
}
