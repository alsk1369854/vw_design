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
  initializationRenameState = {
    item: FileManager.getRootFile(),
    oldName: FileManager.getRootFile().getFileName(),
    temporaryFileName: FileManager.getRootFile().getFileName(),
    message: '',
  }
  state = {
    showContextMenu: false,
    mouseDownXY: { x: 0, y: 0 },
    currentlySelectedItem: FileManager.getRootFile(),
    renameState: this.initializationRenameState,
    // onClickItem: FileManager.getRootFile(),
  }

  documentOnClick = () => {
    FileManager.cleanSelectedFiles()
    this.renameCheckAndSetFileName()
    this.setState({
      showContextMenu: false,
      currentlySelectedItem: FileManager.getRootFile(),
      renameState: this.initializationRenameState,
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
    event.stopPropagation()
    // event.preventDefault()
    this.addToSelectedFiles(event, objFile)

    this.setState({
      currentlySelectedItem: objFile,
      renameState: this.initializationRenameState,
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
    console.log(event)
    if (this.state.renameState.item.getId() !== FileManager.getRootFile().getId()) {
      this.renameRollBack()
      this.setState({
        showContextMenu: true,
        mouseDownXY: { x: event.pageX, y: event.pageY },
        // mouseDownXY: { x: event.screenX, y: event.screenY },
        currentlySelectedItem: objFile,
        renameState: this.initializationRenameState,
      })
    } else {
      this.setState({
        showContextMenu: true,
        mouseDownXY: { x: event.pageX, y: event.pageY },
        currentlySelectedItem: objFile,
      })
    }
  }

  getExpandLine = (strFileId: string, numFileDeep: number) => {
    let expandLine: JSX.Element[] = []
    for (let i = 0; i < numFileDeep; i++) {
      expandLine.push(
        <span
          key={strFileId + "_ExpandLine_" + i}
          className={style.expandLine}>&nbsp;
        </span>
      )
    }
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
    const { target: element, key } = event
    const file = FileManager.getFileById(objFile.strId)
    const [fileNameState, message] = file?.checkFileNewName(element.value)!

    if (key === "Enter" && fileNameState) {
      file?.setFileName(element.value)
      this.setState({
        renameState: this.initializationRenameState
      })
    } else {
      if (fileNameState) file?.setFileName(element.value)
      this.setState({
        renameState: {
          ...this.state.renameState,
          temporaryFileName: element.value,
          message,
        }
      })
    }
  }
  renameCheckAndSetFileName = () => {
    const { renameState } = this.state!
    const file = FileManager.getFileById(renameState.item.strId)
    const [fileNameState] = file?.checkFileNewName(renameState.temporaryFileName)!

    return (fileNameState) ?
      file?.setFileName(renameState.temporaryFileName) :
      this.renameRollBack()
  }
  renameRollBack = () => {
    const { renameState } = this.state
    const file = FileManager.getFileById(renameState.item.strId)
    if (renameState.oldName === '') {
      file?.delete()
    } else {
      file?.setFileName(renameState.oldName)
    }
  }

  renameOnFocus = (event: any) => {
    event.target.setSelectionRange(0, this.state.renameState.oldName.indexOf('.'))
  }

  getFileClassName = (objFile: FileConstructor) => {
    const { renameState, currentlySelectedItem } = this.state
    // 是否在 rename 狀態
    if (renameState.item !== FileManager.getRootFile()) { // 是 rename 狀態
      // 是否為 rename 項目
      if (renameState.item.getId() === objFile.strId) { // 是 rename 項目
        // 是否在選中清單
        if (FileManager.selectedFileIsExists(objFile)) { // 在選中清單
          return style.fileItemRenameItemOnSelected
        } else { // 不在選中清單
          return style.fileItemRenameItem
        }
      } else { // 不是 rename 項目
        // 是否在選中清單
        if (FileManager.selectedFileIsExists(objFile)) { // 在選中清單
          return style.fileItemOnSelectedRenameState
        } else { // 不在選中清單
          return style.fileItemRenameState
        }
      }
    } else { // 不是 rename 狀態
      // 是否在選中清單
      if (FileManager.selectedFileIsExists(objFile)) { // 在選中清單
        // 是否為當前選取項
        if(currentlySelectedItem.strId === objFile.strId){ // 是當前選取項
          return style.fileItemCurrentlySelected
        }else{ // 不是當前選取項
          return style.fileItemOnSelected
        }
      } else { // 不在選中清單
        // 是否為當前選取項
        if(currentlySelectedItem.strId === objFile.strId){ // 是當前選取項
          return style.fileItemCurrentlyContextMenu
        }else{ // 不是當前選取項
          return style.fileItem
        }
      }
    }
  }

  render() {
    const {
      showContextMenu,
      mouseDownXY,
      currentlySelectedItem,
      renameState
    } = this.state

    console.log(this.state)
    // console.log(objMapFileIconMap.get("1"))
    return (
      <div
        onClick={() => this.setState({ showContextMenu: false })}
        onContextMenu={event => this.showItemContextMenu(event, FileManager.getRootFile())}
      >
        <FileManagerTitle parentThis={this} />
        <div
        className = {style.fileManagerBody}
          // className={
          //   // 使否有 rename 項目
          //   (renameState.item === FileManager.getRootFile()) ?
          //     // 沒有 rename 項目
          //     style.body :
          //     // 有 rename 項目
          //     style.bodyRenameState
          // }
        >
          {showContextMenu ?
            <ContextMenu
              parentThis={this}
              file={currentlySelectedItem}
              x={mouseDownXY.x}
              y={mouseDownXY.y}
            /> :
            <></>
          }
          {this.getFileList().map(item => {
            return <div
              key={item.strId}
              onClick={(event) => this.clickItem(event, item)}
              onDoubleClick={(event) => this.doubleClickItem(event, item)}
              onContextMenu={(event) => this.showItemContextMenu(event, item)}
              className={this.getFileClassName(item)}
            // className={
            //   // 是否為 rename 狀態與 rename 項目
            //   (renameState.item !== FileManager.getRootFile()
            //     && item.strId === renameState.item.getId()) ?
            //     // 是 rename 狀態與 rename 項目，檢查是在選取列表
            //     (FileManager.selectedFileIsExists(item)) ?
            //       // 在選取列表中
            //       style.fileItemRenameItemOnSelected :
            //       // 不在選取列表中
            //       style.fileItemRenameItem :
            //     // 不是 rename 狀態與 rename 項目，檢查是否在選取列表
            //     (FileManager.selectedFileIsExists(item)) ?
            //       // 在選取列表中，檢查是否為當前選取項
            //       (item.strId === currentlySelectedItem.strId) ?
            //         // 被選中且是當前選取項
            //         style.fileItemCurrentlySelected :
            //         // style.fileItemOnSelected :
            //       // 被選中但不是當前選取項，檢查是否為 rename 狀態
            //       (renameState.item !== FileManager.getRootFile()) ?
            //         // 是 呈現 rename 狀態下被選中
            //         style.fileItemOnSelectedRenameState :
            //         // 不是 呈現 一般 狀態下被選中
            //         style.fileItemOnSelected :
            //       // 未在選取列表中，檢查是否為當前ContextMenu項
            //       (item.strId === currentlySelectedItem.strId) ?
            //         // 未被選中且是當前Contextmenu項
            //         style.fileItemCurrentlyContextMenu :
            //         // 未被選中但不是當前Contextmenu項
            //         style.fileItem
            // }
            >
              {this.getExpandLine(item.strId, item.deep!)}

              <span className={style.angleIcon}>
                {(item.numFileType === 1) ?
                  (item.boolIsExpand) ?
                    <FontAwesomeIcon icon={faAngleDown} /> :
                    <FontAwesomeIcon icon={faAngleRight} /> :
                  <FontAwesomeIcon
                    icon={faSquareFull}
                    className={style.isFileAngleIconBackground}
                  />
                }
              </span>

              {FileManager.getFileIcon(item)}

              {/* 是否為 rename 狀態 */}
              {(renameState.item.strId === item.strId) ?
                <span
                  className={style.renameBar}
                  // style={{ width: `calc(100px - ${item.deep! * 10 + 40 + 5}px)` }}
                  style={{ width: `calc(100% - ${item.deep! * 10 + 41}px)` }}
                >
                  <input
                    className={
                      (renameState.message !== '') ?
                        style.renameInputWarning :
                        style.renameInput
                    }
                    autoFocus
                    defaultValue={renameState.temporaryFileName}
                    onFocus={this.renameOnFocus}
                    onChange={(event => this.renameEvent(event, item))}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event => this.renameEvent(event, item))}
                  />
                  {(renameState.message !== '') ?
                    <div className={style.renameMessage}>
                      {renameState.message}
                    </div> :
                    <></>
                  }
                </span> :
                <span className={style.fileName}>{item.strFileName}</span>
              }
            </div>
          })}
        </div>
      </div>
    )
  }
}
