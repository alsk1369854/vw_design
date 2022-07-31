import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare, // open
  faFileArrowDown, // download
  faScissors, // cut
  faCopy, // copy
  faPaste, // paste
  faSignature, // rename
  faTrashCan, // delete
} from '@fortawesome/free-solid-svg-icons'

import style from './index.module.scss'
import File from '../lib/File'
import FileManager from '../lib/FileManager'
import { icon, setTemporaryFileName } from '../index'


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
    setTemporaryFileName(objFile.getFileName())
    parentThis.setState({
      renameState: {
        ...renameState,
        file: objFile,
        oldName: objFile.getFileName(),
        // temporaryFileName: objFile.getFileName(),
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
    const {
      parentThis,
      file,
      y: pageY,
      x: pageX
    } = this.props
    // console.log(this.props)
    return (
      <ul className={style.projectContextMenu}
        style={{
          top: pageY,
          left: pageX,
        }}
      >
        {(file.isDirectory()) ?
          <>
            <li onClick={event => parentThis.addFile(event, false)}>
              <span className={style.iconBar}>
                {icon.addFile}
              </span>
              <span className={style.itemName}> Add File</span>
            </li>
            <li onClick={event => parentThis.addFile(event, true)}>
              <span className={style.iconBar}>
                {icon.addDirectory}
              </span>
              <span className={style.itemName}> Add Directory</span>
            </li>
          </> :
          <>
            <li onClick={this.open} >
              <span className={style.iconBar}>
                <FontAwesomeIcon className={style.icon} icon={faArrowUpRightFromSquare} />
              </span>
              <span className={style.itemName}>Open</span>
            </li>
          </>
        }

        <div className={style.line}></div>
        <li>
          <span className={style.iconBar}>
            <FontAwesomeIcon className={style.icon} icon={faScissors} />
          </span>
          <span className={style.itemName}>Cut</span>
        </li>
        <li>
          <span className={style.iconBar}>
            <FontAwesomeIcon className={style.icon} icon={faCopy} />
          </span>
          <span className={style.itemName}>Copy</span>
        </li>

        {(file.isDirectory()) ?
          <>
            <li>
              <span className={style.iconBar}>
                <FontAwesomeIcon className={style.icon} icon={faPaste} />
              </span>
              <span className={style.itemName}>Paste</span>
            </li>
          </> :
          <></>
        }

        <div className={style.line}></div>
        <li onClick={this.download}>
          <span className={style.iconBar}>
            <FontAwesomeIcon className={style.icon} icon={faFileArrowDown} />
          </span>
          <span className={style.itemName}>Download</span>
        </li>

        {(file === FileManager.getRootFile()) ?
          <></> :
          <>
            <div className={style.line}></div>
            <li onClick={event => this.rename(event, file)}>
              <span className={style.iconBar}>
                <FontAwesomeIcon className={style.icon} icon={faSignature} />
              </span>
              <span className={style.itemName}>Rename</span>
            </li>
            <li onClick={this.delete}>
              <span className={style.iconBar}>
                <FontAwesomeIcon className={style.icon} icon={faTrashCan} />
              </span>
              <span className={style.itemName}>Delete</span>
            </li>
          </>
        }
      </ul>

    )
  }
}