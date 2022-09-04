import React, { Component, useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, // create project
} from '@fortawesome/free-solid-svg-icons'


import ContextMenu from './ContextMenu'
import ProjectItem from './ProjectItem'
import FunctionCaller from '../../../tools/FunctionCaller'
import type { IProjectState } from '../lib/ProjectInterfaceCollection'
import ProjectManager from '../lib/ProjectManager'

import style from './index.module.scss'

export const FUNCTION_CALLER_KEY_UPDATE_SHOW_PROJECT_LIST = 'ProjectListFrame_setShowProjectList'

interface IProps {
  utilMenuState: string
}

export default function ProjectListFrame({ utilMenuState }: IProps) {
  const [count, setCount] = useState(0)
  const render = () => setCount(count + 1)

  const [showContextMenu, setShowContextMenu] = useState(false)
  const [showContextProjectState, setShowContextProjectState] = useState<IProjectState>({ ...ProjectManager.initialEditingProjectState })
  const [mouseDownXY, setMouseDownXY] = useState({ x: 0, y: 0 })
  const [showProjectStateList, setShowProjectStateList] = useState<IProjectState[]>(ProjectManager.getShowProjectStateList())

  const documentOnClick = () => {
    setShowContextMenu(false)
  }

  const updateShowProjectStateList = (arrProjectStateList: IProjectState[]) => {
    setShowProjectStateList(arrProjectStateList)
    render()
  }

  useEffect(() => {
    FunctionCaller.set(FUNCTION_CALLER_KEY_UPDATE_SHOW_PROJECT_LIST, updateShowProjectStateList)
    document.addEventListener('click', documentOnClick)
    return () => {
      FunctionCaller.remove(FUNCTION_CALLER_KEY_UPDATE_SHOW_PROJECT_LIST)
      document.removeEventListener('click', documentOnClick)
    }
  })



  const openProjectContextMenu = (event: any, objProjectState: IProjectState) => {
    event.stopPropagation()
    event.preventDefault();
    setShowContextMenu(true)
    setShowContextProjectState(objProjectState)
    setMouseDownXY({ x: event.pageX, y: event.pageY })
    console.log("click item: ", objProjectState);
  }

  // console.log('ProjectListFrame render')
  return (
    <>
      {showContextMenu ? <ContextMenu showContextProjectState={showContextProjectState} mouseDownXY={mouseDownXY} /> : <></>}
      <div className={style.ProjectListBar}>
        <div className={style.listHeaderBar}>
          <div className={style.headerNameTitle}> &nbsp; &nbsp; Name</div>
          <div className={style.headerOwnerTitle}>Owner</div>
          <div className={style.headerLastTimeTitle}>Last edit time</div>
        </div>
        <div className={style.line}></div>
        <div className={style.listContentBar}>
          {(showProjectStateList.length === 0) ?
            <div className={style.createNewProjectArea}
              onClick={ProjectManager.createNewProject}
            >
              <FontAwesomeIcon icon={faPlus} className={style.icon} />
            </div>
            : <div className={style.listMenuBar} >
              {showProjectStateList.map((projectState) =>
                <ProjectItem
                  key={`ProjectItem_${projectState.contents!.strId}`}
                  openProjectContextMenu={openProjectContextMenu}
                  projectState={projectState}
                />
              )}
            </div>
          }
        </div>
      </div>
    </>
  )
}
