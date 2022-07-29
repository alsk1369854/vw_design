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
import File, { FileConstructor } from './lib/File'
import FileManager from './lib/FileManager'
import { Divider } from '../ToolBar'
import FileManagerTitle from './FileManagerTitle'
import ContextMenu from './ContextMenu'


export default class FileManagerView extends Component {
  initializationRenameState = {
    file: FileManager.getRootFile(),
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
    const fileList: any[] = [];
    const buildFileList = (objFile: File, deep: number) => {
      const temp = { objFile, deep }
      fileList.push(temp)
      if (objFile.isDirectory() && objFile.isExpand()) {
        objFile.getSubFiles().forEach((file: File) => buildFileList(file, deep + 1))
      }
    }
    FileManager.getRootFile().getSubFiles().forEach(file => buildFileList(file, 0))
    return fileList
  }

  clickItem = (event: any, objFile: File) => {
    event.stopPropagation()
    // event.preventDefault()

    this.renameCheckAndSetFileName()
    this.addToSelectedFiles(event, objFile)

    this.setState({
      showContextMenu: false,
      currentlySelectedItem: objFile,
      renameState: this.initializationRenameState,
    })
  }

  doubleClickItem = (event: any, objFile: File) => {
    this.renameCheckAndSetFileName()
    FileManager.addOpenFile(objFile)
  }

  showItemContextMenu = (event: any, objFile: File) => {
    event.stopPropagation()
    event.preventDefault()
    const { renameState } = this.state

    if (renameState.file.getId() !== FileManager.getRootFile().getId()) {
      this.renameRollBack()
      this.setState({
        showContextMenu: true,
        mouseDownXY: { x: event.pageX, y: event.pageY },
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

  addToSelectedFiles = (event: any, objFile: File) => {
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

  setFileIsExpand = (event: any, objFile: File) =>
    objFile.setIsExpand(!objFile.isExpand())

  renameEvent = (event: any, objFile: File) => {
    const { target: element, key } = event
    // const file = FileManager.getFileById(objFile.strId)
    const [boolNameCanUsed, strMessage] = objFile.checkFileNewName(element.value)!

    if (key === "Enter" && boolNameCanUsed) {
      objFile.setFileName(element.value)
      this.setState({
        currentlySelectedItem: FileManager.getRootFile(),
        renameState: this.initializationRenameState
      })
    } else {
      this.setState({
        renameState: {
          ...this.state.renameState,
          temporaryFileName: element.value,
          message: strMessage,
        }
      })
    }
  }
  renameCheckAndSetFileName = () => {
    const { renameState } = this.state
    const { file, temporaryFileName } = renameState
    const [fileNameState] = file.checkFileNewName(temporaryFileName)

    return (fileNameState) ?
      file.setFileName(temporaryFileName) :
      this.renameRollBack()
  }
  renameRollBack = () => {
    const { renameState } = this.state
    const { file, oldName } = renameState

    if (renameState.oldName === '') {
      file.delete()
    } else {
      file.setFileName(oldName)
    }
  }

  renameOnFocus = (event: any) => {
    event.target.setSelectionRange(0, this.state.renameState.oldName.indexOf('.'))
  }

  getFileClassName = (objFile: File) => {
    const { renameState, currentlySelectedItem } = this.state
    // 是否在 rename 狀態
    if (renameState.file !== FileManager.getRootFile()) { // 是 rename 狀態
      // 是否為 rename 項目
      if (renameState.file === objFile) { // 是 rename 項目
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
        if (currentlySelectedItem === objFile) { // 是當前選取項
          return style.fileItemCurrentlySelected
        } else { // 不是當前選取項
          return style.fileItemOnSelected
        }
      } else { // 不在選中清單
        // 是否為當前選取項
        if (currentlySelectedItem === objFile) { // 是當前選取項
          return style.fileItemCurrentlyContextMenu
        } else { // 不是當前選取項
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
        <div className={style.fileManagerBody}>
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
            const { objFile: file, deep } = item
            return <div
              key={file.getId()}
              onClick={(event) => this.clickItem(event, file)}
              onDoubleClick={(event) => this.doubleClickItem(event, file)}
              onContextMenu={(event) => this.showItemContextMenu(event, file)}
              className={this.getFileClassName(file)}
            >
              {this.getExpandLine(file.getId(), deep)}

              <span className={style.angleIcon}>
                {(file.isDirectory()) ?
                  (file.isExpand()) ?
                    <FontAwesomeIcon icon={faAngleDown} /> :
                    <FontAwesomeIcon icon={faAngleRight} /> :
                  <FontAwesomeIcon
                    icon={faSquareFull}
                    className={style.isFileAngleIconBackground}
                  />
                }
              </span>

              {/* 是否為 rename 狀態 */}
              {(renameState.file === file) ?
                <>
                  {FileManager.getFileIcon(file, renameState.temporaryFileName)}
                  <span
                    className={style.renameBar}
                    // style={{ width: `calc(100px - ${item.deep! * 10 + 40 + 5}px)` }}
                    style={{ width: `calc(100% - ${deep * 10 + 41}px)` }}
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
                      onChange={(event => this.renameEvent(event, file))}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event => this.renameEvent(event, file))}
                    />
                    {(renameState.message !== '') ?
                      <div className={style.renameMessage}>
                        {renameState.message}
                      </div> :
                      <></>
                    }
                  </span>
                </> :
                <>
                  {FileManager.getFileIcon(file)}
                  <span className={style.fileName}>{file.getFileName()}</span>
                </>
              }
            </div>
          })}
        </div>
      </div>
    )
  }
}
