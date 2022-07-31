import React, { Component } from 'react'


import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCirclePlus, faFolderPlus } from '@fortawesome/free-solid-svg-icons'

import style from './index.module.scss'
import File from './lib/File'
import FileManager from './lib/FileManager'
import Title from './Title'
import ContextMenu from './ContextMenu'
import { FileItem } from './FileItem'
import FileFactory from './lib/FileFactory'

export const icon = {
  addFile: <FontAwesomeIcon icon={faFileCirclePlus} className={style.icon} />,
  addDirectory: <FontAwesomeIcon icon={faFolderPlus} className={style.icon} />,
}


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
    previouslySelectedItem: FileManager.getRootFile(),
    renameState: this.initializationRenameState,
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

  showItemContextMenu = (event: any, objFile: File) => {
    event.stopPropagation()
    event.preventDefault()
    const { renameState } = this.state

    if (!renameState.file.isRootFile()) {
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

  addFile = (event: any, boolIsDirectory: boolean) => {
    event.stopPropagation()
    // const { parentThis } = this.props
    const { currentlySelectedItem, renameState } = this.state

    if (!renameState.file.isRootFile()) return
    const targetDirectory = (currentlySelectedItem.isDirectory()) ?
      currentlySelectedItem :
      currentlySelectedItem.getParent()

    const newFile = FileFactory.getNewFile(boolIsDirectory)
    targetDirectory!.addSubFile(newFile)
    targetDirectory!.setIsExpand(true)
    FileManager.cleanSelectedFiles()
    FileManager.addSelectedFile(newFile)

    this.setState({
      currentlySelectedItem: newFile,
      renameState: {
        ...renameState,
        file: newFile,
        oldName: newFile.strFileName,
        temporaryFileName: newFile.strFileName,
        message: '',
      },
      showContextMenu: false,
    })
  }

  renameEvent = (event: any, objFile: File) => {
    const { target: element, key } = event
    const [boolNameCanUsed, strMessage] = objFile.checkFileNewName(element.value)

    if (key === "Enter" && boolNameCanUsed) {
      objFile.setFileName(element.value)
      FileManager.cleanSelectedFiles()
      FileManager.addSelectedFile(objFile)
      this.setState({
        currentlySelectedItem: objFile,
        renameState: this.initializationRenameState
      })
    } else {
      // objFile.setFileName(element.value)
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

  render() {
    const {
      showContextMenu,
      mouseDownXY,
      currentlySelectedItem,
      renameState
    } = this.state

    console.log(this.state)
    return (
      <div
        className={style.fileManagerBody}
        onClick={() => this.setState({ showContextMenu: false })}
        onContextMenu={event => this.showItemContextMenu(event, FileManager.getRootFile())}
      >
        <Title parentThis={this} />
        <div
          className={style.fileManagerContent}
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
          <DndProvider backend={HTML5Backend}>
            <div style={{ overflow: 'hidden', clear: 'both' }}>
              {this.getFileList().map(item =>
                <FileItem
                  key={`FileItem_${item.objFile.getId()}`}
                  parentThis={this}
                  renameState={renameState}
                  {...item}
                />
              )}
            </div>
          </DndProvider>
        </div>
        <div style={{height:'100px'}}></div>
        <div style={{height:'20px'}}></div>
      </div>
    )
  }
}
