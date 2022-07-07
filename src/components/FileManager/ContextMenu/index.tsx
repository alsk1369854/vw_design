import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare, // open
  faFileArrowDown, // download
  faCopy, // copy
  faSignature, // rename
  faTrashCan,
  faArrowRightToFile, // delete
} from '@fortawesome/free-solid-svg-icons'

import style from './index.module.scss'
import { FileConstructor } from '../File'
import FileManager from '../FileManager'

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
    const objFileConstructor = this.props.file
    if(FileManager.selectedFileIsExists(objFileConstructor)){
      const arrFile = FileManager.getSelectedFiles()
      arrFile.forEach( file => FileManager.addOpenFile(file))
    }else{
      FileManager.addOpenFile(objFileConstructor)
    }
  }

  rename = (event:any, objFile:FileConstructor) => {
    event.stopPropagation()
    // this.props.setRenameItem(objFile)
    this.props.parentThis.setState({
      renameState: {
        item: objFile,
        oldName: objFile.strFileName,
      },
      showContextMenu: false,
    })
  }

  download = () => FileManager.downloadSeletedFiles()

  delete = () => {
    const file = FileManager.getFileById(this.props.file.strId)
    if(file) file.delete()
  }

  render() {
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
        <li onClick={event =>this.rename(event, this.props.file)}>
          <FontAwesomeIcon className={style.icon} icon={faSignature} />
          <span>Rename</span>
        </li>
        <li>
          <FontAwesomeIcon className={style.icon} icon={faCopy} />
          <span>Copy</span>
        </li>
        <li onClick={this.download}>
          <FontAwesomeIcon className={style.icon} icon={faFileArrowDown} />
          <span>Download</span>
        </li>
        <div className={style.line}></div>
        {/* <hr className="divider" /> */}
        <li onClick={this.delete}>
          <FontAwesomeIcon className={style.icon} icon={faTrashCan} />
          <span>Delete</span>
        </li>
      </ul>

    )
  }
}