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
import FileManagerTitle from './FileManagerTitle'
import ContextMenu from './ContextMenu'
import FileItem from './FileItem'


export default class FileManagerView extends Component {
  objElementFileManagerBody: React.RefObject<HTMLInputElement> = React.createRef()

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
    previouslySelectedItem: FileManager.getRootFile(),
    renameState: this.initializationRenameState,
    // onClickItem: FileManager.getRootFile(),
  }


  documentOnClick = () => {
    FileManager.cleanSelectedFiles()
    this.renameCheckAndSetFileName()
    this.setState({
      showContextMenu: false,
      currentlySelectedItem: FileManager.getRootFile(),
      previouslySelectedItem: FileManager.getRootFile(),
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
    const { currentlySelectedItem, previouslySelectedItem } = this.state
    const objFileRootFile = FileManager.getRootFile()

    this.renameCheckAndSetFileName()
    this.addToSelectedFiles(event, objFile)

    this.setState({
      showContextMenu: false,
      currentlySelectedItem: objFile,
      previouslySelectedItem: (event.shiftKey) ?
        (previouslySelectedItem !== objFileRootFile) ?
          previouslySelectedItem :
          currentlySelectedItem :
        FileManager.getRootFile(),
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
    const { currentlySelectedItem, previouslySelectedItem } = this.state
    const objFileRootFile = FileManager.getRootFile()

    const prevFile = (previouslySelectedItem === objFileRootFile) ?
      currentlySelectedItem :
      previouslySelectedItem

    if (event.ctrlKey || event.metaKey) { // control down
      if (FileManager.selectedFileIsExists(objFile)) {
        FileManager.deleteSelectedFile(objFile)
      } else {
        FileManager.addSelectedFile(objFile)
      }
    } else if (event.shiftKey
      && currentlySelectedItem !== objFileRootFile
      && prevFile !== objFile) { // shift down

      let boolStartAddSeletedFileFlag = false
      FileManager.cleanSelectedFiles()

      this.getFileList().forEach(item => {
        const { objFile: file } = item
        const boolIsTargetFile = (file === objFile || file === prevFile)

        if (boolIsTargetFile) boolStartAddSeletedFileFlag = !boolStartAddSeletedFileFlag
        if (boolStartAddSeletedFileFlag || boolIsTargetFile) FileManager.addSelectedFile(file)
      })
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
      FileManager.cleanSelectedFiles()
      FileManager.addSelectedFile(objFile)
      this.setState({
        currentlySelectedItem: objFile,
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
          ref={this.objElementFileManagerBody}
          className={style.fileManagerBody}
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

          {this.getFileList().map(item =>
            <FileItem
              key={`FileItem_${item.objFile.getId()}`}
              parentThis={this}
              renameState={renameState}
              {...item}
            />
          )}

          {/* {this.getFileList().map(item => {
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
          })} */}
        </div>
      </div>
    )
  }
}
