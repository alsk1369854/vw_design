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
import File from '../lib/File'
import FileManager from '../lib/FileManager'

interface IState { }

interface IProps {
  parentThis: any,
  file: File,
  x: string | number,
  y: string | number,
}

export default class ContextMenu extends Component<IProps, IState> {
  open = () => {
    // console.log(this.props.file, " => open")
    const { file } = this.props
    if (FileManager.selectedFileIsExists(file)) {
      FileManager.addOpenFileSeletedFiles()
    } else {
      FileManager.addOpenFile(file)
    }
  }

  rename = (event: any, objFile: File) => {
    event.stopPropagation()
    const { parentThis } = this.props
    const { renameState } = parentThis.state
    // this.props.setRenameItem(objFile)
    parentThis.setState({
      renameState: {
        ...renameState,
        file: objFile,
        oldName: objFile.getFileName(),
        temporaryFileName: objFile.getFileName(),
        message: '',
      },
      showContextMenu: false,
    })
  }

  download = () => {
    const { file } = this.props
    if (FileManager.selectedFileIsExists(file)) {
      FileManager.downloadSeletedFiles()
    } else {
      FileManager.downloadFile(file)
    }
  }

  delete = () => {
    const { file } = this.props
    if (FileManager.selectedFileIsExists(file)) {
      FileManager.getSelectedFiles().forEach(file => file.delete())
    } else {
      file.delete()
    }
  }

  render() {
    const { file, y: pageY, x: pageX } = this.props
    // console.log(this.props)
    return (
      <ul className={style.projectContextMenu}
        style={{
          top: pageY,
          left: pageX,
        }}
      >
        {(file.isDirectory()) ?
          <></> :
          <>
            <li onClick={this.open} >
              <FontAwesomeIcon className={style.icon} icon={faArrowUpRightFromSquare} />
              <span>Open</span>
            </li>
          </>
        }

        {/* <div className={style.line}></div> */}
        <li onClick={this.download}>
          <FontAwesomeIcon className={style.icon} icon={faFileArrowDown} />
          <span>Download</span>
        </li>

        <div className={style.line}></div>
        <li>
          <FontAwesomeIcon className={style.icon} icon={faCopy} />
          <span>Copy</span>
        </li>
        
        {(file.isDirectory()) ?
          <>
            <li>
              <FontAwesomeIcon className={style.icon} icon={faPaste} />
              <span>Paste</span>
            </li>
          </> :
          <></>
        }

        {(file === FileManager.getRootFile()) ?
          <></> :
          <>
            <div className={style.line}></div>
            {/* <hr className="divider" /> */}
            <li onClick={event => this.rename(event, file)}>
              <FontAwesomeIcon className={style.icon} icon={faSignature} />
              <span>Rename</span>
            </li>
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