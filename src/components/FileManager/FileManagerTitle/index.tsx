import React, { Component } from 'react'
import style from './index.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCirclePlus, faFolderPlus } from '@fortawesome/free-solid-svg-icons'

import FileManager from '../lib/FileManager'
import FileFactory from '../lib/FileFactory'

interface IState { }

interface IProps {
  parentThis: any,
}

export default class FileManagerTitle extends Component<IProps, IState> {
  addFile = (event: any, numFileType: number) => {
    event.stopPropagation()
    const { parentThis } = this.props
    let { currentlySelectedItem, renameState } = parentThis.state

    if (renameState.item !== FileManager.getRootFile()) return
    currentlySelectedItem = (currentlySelectedItem.getFileType() === 1) ?
      currentlySelectedItem : FileManager.getRootFile()

    const newFile = FileFactory.getNewFile(numFileType)
    currentlySelectedItem.addSubFile(newFile)
    currentlySelectedItem.setIsExpand(true)
    FileManager.cleanSelectedFiles()
    FileManager.addSelectedFile(newFile)

    parentThis.setState({
      renameState: {
        ...renameState,
        item: newFile,
        oldName: newFile.strFileName,
        temporaryFileName: newFile.strFileName,
        message: '',
      },
      showContextMenu: false,
    })
  }

  render() {
    return (
      <div className={style.titleBody}>
        {(FileManager.getRootFile()) ?
          <div className={style.titleBar}>
            <div className={style.projectName}>
              {FileManager.getRootFile().getFileName()}
            </div>
            <span className={style.iconBar}>
              <div onClick={(event) => this.addFile(event, -1)} className={style.iconItem}>
                <FontAwesomeIcon icon={faFileCirclePlus} className={style.icon} />
              </div>
              <div onClick={(event) => this.addFile(event, 1)} className={style.iconItem}>
                <FontAwesomeIcon icon={faFolderPlus} className={style.icon} />
              </div>
            </span>
          </div> :
          <></>
        }

      </div>
    )
  }
}
