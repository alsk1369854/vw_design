import React, { Component, useEffect, useState } from 'react'

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
  const [showContextProjectId, setShowContextProjectId] = useState("")
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



  const openProjectContextMenu = (event: any, id: string) => {
    event.stopPropagation()
    event.preventDefault();
    setShowContextMenu(true)
    setShowContextProjectId(id)
    setMouseDownXY({ x: event.pageX, y: event.pageY })
    console.log("click item: ", id);
  }

  // console.log('ProjectListFrame render')
  return (
    <>
      {showContextMenu ? <ContextMenu projectId={showContextProjectId} x={mouseDownXY.x} y={mouseDownXY.y} /> : <></>}
      <div className={style.ProjectListBar}>
        <div className={style.listHeaderBar}>
          <div className={style.headerNameTitle}>Name</div>
          <div className={style.headerOwnerTitle}>Owner</div>
          <div className={style.headerLastTimeTitle}>Last Modified Time</div>
        </div>
        <div className={style.line}></div>
        <div className={style.listMenuBar} >

          {showProjectStateList.map((projectState) =>
            <ProjectItem
              key={`ProjectItem_${projectState.contents!.strId}`}
              openProjectContextMenu={openProjectContextMenu}
              projectState={projectState}
            />
          )}

        </div>
      </div>
    </>
  )
}
