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
  state = {
    newFile: false,
  }
  addFile = (event: any, boolIsDirectory: boolean) => {
    event.stopPropagation()
    const { parentThis } = this.props
    const { currentlySelectedItem, renameState } = parentThis.state

    if (!renameState.file.isRootFile()) return
    const targetDirectory = (currentlySelectedItem.isDirectory()) ?
      currentlySelectedItem :
      FileManager.getRootFile()

    const newFile = FileFactory.getNewFile(boolIsDirectory)
    targetDirectory.addSubFile(newFile)
    targetDirectory.setIsExpand(true)
    FileManager.cleanSelectedFiles()
    FileManager.addSelectedFile(newFile)

    parentThis.setState({
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

  render() {
    return (
      <div className={style.titleBody}>
        {(FileManager.getRootFile()) ?
          <div className={style.titleBar}>
            <div className={style.projectName}>
              {FileManager.getRootFile().getFileName()}
            </div>
            <span className={style.iconBar}>
              <div // add File
                onClick={(event) => this.addFile(event, false)}
                className={style.iconItem}
              >
                <FontAwesomeIcon icon={faFileCirclePlus} className={style.icon} />
              </div>
              <div // add Directory
                onClick={(event) => this.addFile(event, true)}
                className={style.iconItem}
              >
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
