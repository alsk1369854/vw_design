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
    const isDisabled = FileManager.rootFileIsDisabled()

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
                onClick={(isDisabled) ? () => { } : (event) => parentThis.addFile(event, false)}
                className={(isDisabled) ? style.iconItemDisabled : style.iconItem}
              >
                {icon.addFile}
              </div>
              <div // add Directory
                onClick={(isDisabled) ? () => { } : (event) => parentThis.addFile(event, true)}
                className={(isDisabled) ? style.iconItemDisabled : style.iconItem}
              >
                {icon.addDirectory}
              </div>
              <div // close all Directory
                onClick={(isDisabled) ? () => { } : FileManager.closeAllExpandDirectory}
                className={(isDisabled) ? style.iconItemDisabled : style.iconItem}
              >
                {icon.closeAllDirectory}
              </div>
            </span>
          </div> :
          <></>
        }

      </div>
    )
  }
}
