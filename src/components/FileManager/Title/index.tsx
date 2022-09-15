import React, { Component } from 'react'
import style from './index.module.scss'

import FileManager from '../lib/FileManager'
import { icon } from '../index'
import { IProjectContents } from '../../ProjectFrame/lib/ProjectInterfaceCollection'

interface IState { }

interface IProps {
  parentThis: any,
  isEditing: boolean,
  projectContents: IProjectContents | undefined,
}

export default class FileManagerTitle extends Component<IProps, IState> {

  render() {
    const {
      parentThis,
      isEditing,
      projectContents,
    } = this.props
    // const isDisabled = FileManager.rootFileIsDisabled()

    return (
      <div
        className={style.titleBody}
        onContextMenu={(event: any) => event.stopPropagation()}
      >
        {(FileManager.getRootFile()) ?
          <div className={style.titleBar}>
            <div className={style.projectName}>
              {(isEditing && projectContents) ? projectContents.strName : 'VW DESIGN'}
            </div>
            <span className={style.iconBar}>
              <div // add File
                onClick={(isEditing) ? (event) => parentThis.addFile(event, false) : () => { }}
                className={(isEditing) ? style.iconItem : style.iconItemDisabled}
              >
                {icon.addFile}
              </div>
              <div // add Directory
                onClick={(isEditing) ? (event) => parentThis.addFile(event, true) : () => { }}
                className={(isEditing) ? style.iconItem : style.iconItemDisabled}
              >
                {icon.addDirectory}
              </div>
              <div // close all Directory
                onClick={(isEditing) ? FileManager.closeAllExpandDirectory : () => { }}
                className={(isEditing) ? style.iconItem : style.iconItemDisabled}
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
