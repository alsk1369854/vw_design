import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare, // open
  faFileArrowDown, // download
  faCopy, // copy
  faPaste, // paste
  faSignature, // rename
  faTrashCan, // delete
} from '@fortawesome/free-solid-svg-icons'

import style from './index.module.scss'
import { FileConstructor } from '../lib/File'
import FileManager from '../lib/FileManager'

interface IState { }

interface IProps {
  parentThis: any,
  file: FileConstructor,
  x: string | number,
  y: string | number,
}

export default class ContextMenu extends Component<IProps, IState> {
  open = () => {
    // console.log(this.props.file, " => open")
    const { file: objFileConstructor } = this.props
    if (FileManager.selectedFileIsExists(objFileConstructor)) {
      const arrFile = FileManager.getSelectedFiles()
      arrFile.forEach(file => FileManager.addOpenFile(file))
    } else {
      FileManager.addOpenFile(objFileConstructor)
    }
  }

  rename = (event: any, objFile: FileConstructor) => {
    event.stopPropagation()
    const { parentThis } = this.props
    const { renameState } = parentThis.state
    // this.props.setRenameItem(objFile)
    parentThis.setState({
      renameState: {
        ...renameState,
        item: objFile,
        oldName: objFile.strFileName,
        temporaryFileName: objFile.strFileName,
        message: '',
      },
      showContextMenu: false,
    })
  }

  download = () => {
    const { file: objFileConstructor } = this.props
    if (FileManager.selectedFileIsExists(objFileConstructor)) {
      FileManager.downloadSeletedFiles()
    } else {
      const file = FileManager.getFileById(objFileConstructor.strId)
      if (file) FileManager.downloadFile(file)
    }
  }

  delete = () => {
    const { file: objFileConstructor } = this.props
    if (FileManager.selectedFileIsExists(objFileConstructor)) {
      FileManager.getSelectedFiles().forEach(file => file.delete())
    } else {
      const file = FileManager.getFileById(objFileConstructor.strId)
      if (file) file.delete()
    }
  }

  render() {

    const { file: objFileConstructor } = this.props
    const file = FileManager.getFileById(objFileConstructor.strId)
    // console.log(this.props)
    return (
      <ul className={style.projectContextMenu}
        style={{
          top: this.props.y,
          left: this.props.x
        }}
      >
        <li onClick={this.open} >
          <FontAwesomeIcon className={style.icon} icon={faArrowUpRightFromSquare} />
          <span>Open</span>
        </li>
        <li onClick={event => this.rename(event, this.props.file)}>
          <FontAwesomeIcon className={style.icon} icon={faSignature} />
          <span>Rename</span>
        </li>
        <li>
          <FontAwesomeIcon className={style.icon} icon={faCopy} />
          <span>Copy</span>
        </li>
        <li>
          <FontAwesomeIcon className={style.icon} icon={faPaste} />
          <span>Paste</span>
        </li>
        <li onClick={this.download}>
          <FontAwesomeIcon className={style.icon} icon={faFileArrowDown} />
          <span>Download</span>
        </li>
        {(file === FileManager.getRootFile()) ?
          <></> :
          <>
            <div className={style.line}></div>
            {/* <hr className="divider" /> */}
            <li onClick={this.delete}>
              <FontAwesomeIcon className={style.icon} icon={faTrashCan} />
              <span>Delete</span>
            </li>
          </>
        }
      </ul>

    )
  }
}