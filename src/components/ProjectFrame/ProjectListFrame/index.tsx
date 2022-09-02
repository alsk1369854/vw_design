import React, { Component, useEffect, useState } from 'react'

import ContextMenu from './ContextMenu'
import ProjectItem from './ProjectItem'
import FunctionCaller from '../../../tools/FunctionCaller'
import type { IProjectInfo } from '../lib/IProjectInfo'
import ProjectManager from '../lib/ProjectManager'

import style from './index.module.scss'

export const FUNCTION_CALLER_KEY_SET_ARR_PROJECT_LIST = 'ProjectListFrame_setArrProjectList'

interface IProps {
  utilMenuState: string
}

export default function ProjectListFrame({ utilMenuState }: IProps) {
  const [count, setCount] = useState(0)
  const render = () => setCount(count + 1)

  const [showContextMenu, setShowContextMenu] = useState(false)
  const [showContextProjectId, setShowContextProjectId] = useState("")
  const [mouseDownXY, setMouseDownXY] = useState({ x: 0, y: 0 })
  const [showProjectList, setShowProjectList] = useState<IProjectInfo[]>(ProjectManager.showProjectList)

  const documentOnClick = () => {
    setShowContextMenu(false)
  }

  // const setProjectList = (arrProjectList: IProjectInfo[], callback: Function) => {
  //   setArrProjectList(arrProjectList)
  //   render()
  //   // callback()
  // }

  useEffect(() => {
    // FunctionCaller.set(FUNCTION_CALLER_KEY_SET_ARR_PROJECT_LIST, setProjectList)
    document.addEventListener('click', documentOnClick)
    return () => {
      // FunctionCaller.remove(FUNCTION_CALLER_KEY_SET_ARR_PROJECT_LIST)
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

          {showProjectList.map(projectInfo =>
            <ProjectItem
              key={`ProjectItem_${projectInfo.strId}`}
              openProjectContextMenu={openProjectContextMenu}
              projectInfo={projectInfo}
            />
          )}

        </div>
      </div>
    </>
  )
}
