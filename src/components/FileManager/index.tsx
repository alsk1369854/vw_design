import React, { Component } from 'react'


import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSquarePlus, // add file
  faFolderPlus, // add directory
} from '@fortawesome/free-solid-svg-icons'
import {
  faFolderClosed, // close all directory
} from '@fortawesome/free-regular-svg-icons'

import style from './index.module.scss'
import File from './lib/File'
import FileManager from './lib/FileManager'
import Title from './Title'
import { Content } from './Content'
// import ContextMenu from './ContextMenu'
// import { FileItem } from './FileItem'
import FileFactory from './lib/FileFactory'

export const icon = {
  addFile: <FontAwesomeIcon icon={faSquarePlus} className={style.icon} />,
  addDirectory: <FontAwesomeIcon icon={faFolderPlus} className={style.icon} />,
  closeAllDirectory: <FontAwesomeIcon icon={faFolderClosed} className={style.icon} />,
}

const RenameTemporaryStorage = {
  temporaryFileName: '',
  renameMessage: ''
}
export const setTemporaryFileName = (strFileNmae: string) =>
  RenameTemporaryStorage.temporaryFileName = strFileNmae
export const getTemporaryFileName = () =>
  RenameTemporaryStorage.temporaryFileName
export const setTemporaryMessage = (strRenameMessage: string) =>
  RenameTemporaryStorage.renameMessage = strRenameMessage
export const getTemporaryMessage = () =>
  RenameTemporaryStorage.renameMessage

interface IProp { }
interface IState {
  showContextMenu: boolean,
  mouseDownXY: any,
  currentlySelectedItem: File,
  previouslySelectedItem: File,
  renameState: any,
}

export default class FileManagerView extends Component<IProp, IState> {

  initializationRenameState = {
    file: FileManager.getRootFile(),
    oldName: FileManager.getRootFile().getFileName(),
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
      // activeDragAndDropState: this.initializationDragAndDropState,
    })
  }
  componentDidMount() {
    document.addEventListener('click', this.documentOnClick);
    // this.setState({currentlySelectedItem: FileManager.getRootFile()})
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.documentOnClick);
    FileManager.cleanSelectedFiles()
    this.renameCheckAndSetFileName()
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
    setTemporaryFileName(newFile.getFileName())
    setTemporaryMessage('')

    this.setState({
      currentlySelectedItem: newFile,
      renameState: {
        ...renameState,
        file: newFile,
        oldName: newFile.strFileName,
        // temporaryFileName: newFile.strFileName,
        message: '',
      },
      showContextMenu: false,
    })
  }

  renameCheckAndSetFileName = () => {
    const { renameState } = this.state
    const { file } = renameState
    if (file.isRootFile()) return
    const temporaryFileName = getTemporaryFileName()
    const result = file.checkFileNewName(temporaryFileName)
    const { state } = result

    if (state) {
      file.setFileName(temporaryFileName)
    } else {
      this.renameRollBack()
    }
    setTemporaryFileName('')
    setTemporaryMessage('')
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

    return (
      <div
        className={style.fileManagerBody}
        onContextMenu={event => this.showItemContextMenu(event, FileManager.getRootFile())}
      >
        <Title parentThis={this} />

        <DndProvider backend={HTML5Backend}>
          <Content parentThis={this} />
        </DndProvider>

      </div>
    )
  }
}
