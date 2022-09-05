import React from 'react'

import style from './index.module.scss'
import OpenIcon from '../../../../assets/icon/Open.png'
import DownloadIcon from '../../../../assets/icon/Download.png'
import CopyIcon from '../../../../assets/icon/Copy.png'
import RenameIcon from '../../../../assets/icon/Rename.png'
// import MarkIcon from '../../../../assets/icon/Star.png'
// import DetailIcon from '../../../../assets/icon/Detail.png'
import AshcanIcon from '../../../../assets/icon/Ashcan.png'
import { IProjectState } from '../../lib/ProjectInterfaceCollection'
import ProjectManager from '../../lib/ProjectManager'

interface IMouseDownXY {
  x: string | number,
  y: string | number,
}

// interface IState { }

interface IProps {
  showContextProjectState: IProjectState,
  mouseDownXY: IMouseDownXY
}

export default function ContextMenu({
  showContextProjectState,
  mouseDownXY
}: IProps) {
  const boolHasProjectHomeDirectory = ProjectManager.getProjectHomeDirectoryHandle()

  return (
    <ul className={style.projectContextMenu}
      style={{ top: mouseDownXY.y, left: mouseDownXY.x }}
    >
      <li onClick={() => ProjectManager.doEditProject(showContextProjectState)} >
        <img src={OpenIcon} alt="Open icon" />
        <span>Edit</span>
      </li>
      <li onClick={() => ProjectManager.copyProject(showContextProjectState)}>
        <img src={CopyIcon} alt="Copy icon"></img>
        <span>Copy</span>
      </li>
      {/* <li>
        <img src={MarkIcon} alt=" Mark icon" />
        <span>Mark</span>
      </li> */}
      {/* <li>
        <img src={DetailIcon} alt="Detail icon" />
        <span>Detail</span>
      </li> */}
      <div className={style.line}></div>
      <li onClick={() => ProjectManager.downloadProject(showContextProjectState)}>
        <img src={DownloadIcon} alt="Download icon" />
        <span>Download</span>
      </li>
      {(boolHasProjectHomeDirectory) ?
        <>
          <div className={style.line}></div>
          <li onClick={()=> ProjectManager.renameProject(showContextProjectState)}>
            <img src={RenameIcon} alt="Rename icon" />
            <span>Rename</span>
          </li>

          <li onClick={() => ProjectManager.deleteProject(showContextProjectState)}>
            <img src={AshcanIcon} alt="Delete icon" />
            <span>Delete</span>
          </li>
        </>
        : <></>
      }
    </ul>

  )
}
