import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleRight,
  faAngleDown,
  faSquareFull,
  faFileCirclePlus,
  faFolderPlus,

} from '@fortawesome/free-solid-svg-icons'

import style from './index.module.scss'
// import File from './File_temp'
import File, { FileConstructor } from './lib/File'
import FileManager from './lib/FileManager'
import { Divider } from '../ToolBar'
import FileManagerTitle from './FileManagerTitle'
import ContextMenu from './ContextMenu'




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



// FileManager.download('test.txt', 'test')
export default class FileManagerView extends Component {
  state = {
    showContextMenu: false,
    mouseDownXY: { x: 0, y: 0 },
    currentlySelectedItem: FileManager.getRootFile(),
    renameState: {
      item: FileManager.getRootFile(),
      oldName: FileManager.getRootFile().getFileName(),
    }
    // onClickItem: FileManager.getRootFile(),
  }

  documentOnClick = () => {
    FileManager.cleanSelectedFiles()
    this.renameRollBack()
    this.setState({
      showContextMenu: false,
      currentlySelectedItem: FileManager.getRootFile(),
      renameState: {
        item: FileManager.getRootFile(),
        oldName: FileManager.getRootFile().getFileName(),
      }
    })
  }
  componentDidMount() {
    document.addEventListener('click', this.documentOnClick);
    // this.setState({currentlySelectedItem: FileManager.getRootFile()})
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.documentOnClick);
  }

  getFileList = () => {
    const fileList: FileConstructor[] = [];
    const buildFileList = (objFile: FileConstructor, deep: number) => {
      const temp = { ...objFile, deep }
      fileList.push(temp)
      if (objFile.arrFileSubFiles && objFile.numFileType === 1 && objFile.boolIsExpand) {
        objFile.arrFileSubFiles.forEach((file: FileConstructor) => buildFileList(file, deep + 1))
      }
    }
    FileManager.getRootFile().arrFileSubFiles.forEach(file => buildFileList(file, 0))
    return fileList
  }

  clickItem = (event: any, objFile: FileConstructor) => {
    // const file = FileManager.getFileById(objFile.strId)
    // const isSubFile = file?.isSubFileOf(FileManager.getRootFile().getSubFiles()[0])
    // const isSubFile = file?.isSubFileOf(FileManager.getRootFile())
    // console.log(isSubFile)

    event.stopPropagation()
    // event.preventDefault()
    this.addToSelectedFiles(event, objFile)
    // this.renameRollBack()
    this.setState({
      currentlySelectedItem: objFile,
      renameState: {
        item: FileManager.getRootFile(),
        oldName: FileManager.getRootFile().getFileName(),
      },
    })
  }

  doubleClickItem = (event: any, objFile: FileConstructor) => {
    if (objFile.numFileType !== 1) {
      FileManager.addOpenFile(objFile)
    }
    // console.log(FileManager.getOpenFiles())
  }

  showItemContextMenu = (event: any, objFile: FileConstructor) => {
    event.stopPropagation()
    event.preventDefault()
    this.setState({
      showContextMenu: true,
      mouseDownXY: { x: event.pageX, y: event.pageY },
      currentlySelectedItem: objFile,
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
    if (file && file.numFileType === 1) {
      file.boolIsExpand = !file.boolIsExpand
    }
  }

  renameEvent = (event: any, objFile: FileConstructor) => {
    const file = FileManager.getFileById(objFile.strId)
    if (file) file.setFileName(event.target.value)
    if (event.key === "Enter") {
      if (event.target.value === '') {
        alert('必須提供資料或資料夾名稱')
      } else {
        this.setState({
          renameState: {
            item: FileManager.getRootFile(),
            oldName: FileManager.getRootFile().getFileName(),
          }
        })
      }
    } else {
      this.setState({})
    }
  }

  renameRollBack = () => {
    const { renameState } = this.state
    const file = FileManager.getFileById(renameState.item.strId)
    if (renameState.oldName === '') {
      file?.delete()
    } else {
      file?.setFileName(this.state.renameState.oldName)
    }
  }

  renameOnFocus = (event: any) => {
    event.target.setSelectionRange(0, this.state.renameState.oldName.indexOf('.'))
  }

  render() {
    console.log(this.state)
    // console.log(objMapFileIconMap.get("1"))
    return (
      <div onClick={() => this.setState({ showContextMenu: false })}>
        <FileManagerTitle parentThis={this} />
        <div
          className={style.body}
          style={
            // 是否為 rename 狀態
            (this.state.renameState.item.strId.toLocaleUpperCase() !== 'ROOT') ?
              { backgroundColor: 'rgb(55, 55, 55)' } : {}
          }
        >
          {this.state.showContextMenu ? <ContextMenu parentThis={this} file={this.state.currentlySelectedItem} x={this.state.mouseDownXY.x} y={this.state.mouseDownXY.y} /> : <></>}
          {this.getFileList().map(item => {
            return <div
              key={item.strId}
              className={style.fileItem}
              onClick={(event) => this.clickItem(event, item)}
              onDoubleClick={(event) => this.doubleClickItem(event, item)}
              onContextMenu={(event) => this.showItemContextMenu(event, item)}
              style={
                // 是否為 rename 狀態
                (this.state.renameState.item.strId.toLocaleUpperCase() !== 'ROOT' && item.strId !== this.state.renameState.item.getId()) ?
                  // 為 rename 狀態
                  { backgroundColor: 'rgb(55, 55, 55)', color: 'rgb(128, 128, 128)' } :
                  // 不為 rename 狀態，檢查是否被選中
                  (FileManager.selectedFileIsExists(item)) ?
                    // 在已選清單中
                    (this.state.currentlySelectedItem.strId === item.strId) ?
                      { borderStyle: 'solid', borderColor: 'rgb(0,127,212)', marginLeft: '-1.5px', backgroundColor: 'rgb(9,71,113)' } :
                      { backgroundColor: 'rgb(9,71,113)' } :
                    // 未在已選清單中
                    (this.state.currentlySelectedItem.strId === item.strId) ?
                      { borderStyle: 'solid', borderColor: 'rgb(0,127,212)', marginLeft: '-1.5px' } :
                      {}
              }
            >
              {this.getExpandLine(item.strId, item.deep!)}

              <span className={style.angleIcon}>
                {(item.numFileType === 1) ? (item.boolIsExpand) ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} /> :
                  <FontAwesomeIcon icon={faSquareFull} className={style.isFileAngleIconBackground} />}
              </span>

              {FileManager.getFileIcon(item)}

              {(this.state.renameState.item.strId === item.strId) ?
                <span
                  className={style.renameBar}
                  style={{ width: `calc(100% - ${item.deep! * 10 + 40 + 5}px)` }}
                >
                  <input
                    className={style.renameInput}
                    autoFocus
                    // style={{ width: `calc(100px - ${item.deep! * 10 + 40 + 5}px)` }}
                    defaultValue={item.strFileName}
                    onFocus={this.renameOnFocus}
                    onChange={(event => this.renameEvent(event, item))}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event => this.renameEvent(event, item))}
                  />
                  <div
                    className={style.renameMessage}
                  >
                    tst
                  </div>
                </span> :
                <span>{item.strFileName}</span>
              }

            </div>
          })}
        </div>
      </div>
    )
  }
}
