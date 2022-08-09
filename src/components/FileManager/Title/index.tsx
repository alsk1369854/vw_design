import React, { Component } from 'react'
import style from './index.module.scss'

import FileManager from '../lib/FileManager'
import { icon } from '../index'

interface IState { }

interface IProps {
  parentThis: any,
}

export default class FileManagerTitle extends Component<IProps, IState> {


  render() {
    const { parentThis } = this.props

    return (
      <div
        className={style.titleBody}
        onContextMenu={(event: any) => event.stopPropagation()}
      >
        {(FileManager.getRootFile()) ?
          <div className={style.titleBar}>
            <div className={style.projectName}>
              {FileManager.getRootFile().getFileName()}
            </div>
            <span className={style.iconBar}>
              <div // add File
                onClick={(event) => parentThis.addFile(event, false)}
                className={style.iconItem}
              >
                {icon.addFile}
              </div>
              <div // add Directory
                onClick={(event) => parentThis.addFile(event, true)}
                className={style.iconItem}
              >
                {icon.addDirectory}
              </div>
            </span>
          </div> :
          <></>
        }

      </div>
    )
  }
}
