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
          strData: "html",
          boolIsExpand: false,
          arrFileSubFiles: []
        },
        {
          strId: "1-2-2",
          strFileName: "style.css",
          numFileType: 4,
          strData: "css",
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
          strData: "js",
          boolIsExpand: false,
          arrFileSubFiles: []
        },
      ]
    },
    {
      strId: "3",
      strFileName: "img.png",
      numFileType: 6,
      strData: "",
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
    // onClickItem: FileManager.getRootFile(),
  }
  componentDidMount(){
    document.addEventListener('click', () => this.setState({showContextMenu:false}));
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
    // event.stopPropagation()
    // event.preventDefault()
    // console.log(event)
    this.addToSelectedFiles(event, objFile)

    this.setState({showContextMenuItem: objFile})
  }
  doubleClickItem = (event: any, objFile: FileConstructor) => {
    if(objFile.numFileType != 1){
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
      showContextMenuItem: objFile
    })
  }

  getExpandLine = (strFileId: string, numFileDeep: number) => {
    let expandLine: JSX.Element[] = []
    for (let i = 0; i < numFileDeep; i++) expandLine.push(<span key={strFileId + "_ExpandLine_" + i} className={style.expandLine}>&nbsp;</span>)
    return expandLine
  }

  addToSelectedFiles = (event:any, objFile: FileConstructor) => {
    if(event.ctrlKey || event.metaKey){
      if(FileManager.selectedFileIsExists(objFile)){
        FileManager.deleteSelectedFile(objFile)
      }else{
        FileManager.addSelectedFile(objFile)
      }
    }else{
      FileManager.cleanSelectedFiles()
      FileManager.addSelectedFile(objFile)
      this.setFileIsExpand(event, objFile)
    }
  }

  setFileIsExpand = (event:any, objFile: FileConstructor) => {
    const file = FileManager.getFileById(objFile.strId)
    if (file && file.numFileType == 1) {
      file.boolIsExpand = !file.boolIsExpand
    }
  }

  render() {
    // console.log(objMapFileIconMap.get("1"))
    return (
      <div className={style.body} onClick={() => this.setState({ showContextMenu: false })}>
        {this.state.showContextMenu ? <ContextMenu projectId={"0"} x={this.state.mouseDownXY.x} y={this.state.mouseDownXY.y} /> : <></>}
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
                  { borderStyle: 'solid', borderColor: 'rgb(0,127,212)', marginLeft: '-1.5px'} :
                  {}
            }
          >
            {this.getExpandLine(item.strId, item.deep!)}

            <span className={style.angleIcon}>
              {(item.numFileType == 1) ? (item.boolIsExpand) ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} /> :
                <FontAwesomeIcon icon={faSquareFull} className={style.isFileAngleIconBackground} />}
            </span>

            {FileManager.getFileIcon(item)}

            <span>{item.strFileName}</span>
          </div>
        })}
      </div>
    )
  }
}
