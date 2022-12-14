import React, { useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFolderTree, // my Project 
  // faStar, // mark 
  // faFolderOpen, // open Projects Directory
  faArrowsRotate, // renew
  faFileMedical, // create project
  faLaptopFile, // open Project
  faHouseLaptop, // open projects house
} from '@fortawesome/free-solid-svg-icons'

import style from './index.module.scss'
import ProjectManager from '../lib/ProjectManager'
import FunctionCaller from '../../../tools/FunctionCaller'


export const FUNCTION_CALLER_KEY_SET_HAS_PROJECT_HOME_DIRECTORY = 'ProjectFrame/SideMenu: setHasProjectHomeDirectory'

interface IProps {
  utilMenuState: string,
  selectUtilMenuItem: Function,
}

export default function SideMenu({
  utilMenuState,
  selectUtilMenuItem
}: IProps) {

  const [boolHasProjectHomeDirectory, setHasProjectHomeDirectory] = useState(ProjectManager.getProjectHomeDirectoryHandle())

  useEffect(()=>{
    FunctionCaller.set(FUNCTION_CALLER_KEY_SET_HAS_PROJECT_HOME_DIRECTORY, setHasProjectHomeDirectory)
    return ()=>{
      FunctionCaller.remove(FUNCTION_CALLER_KEY_SET_HAS_PROJECT_HOME_DIRECTORY)
    }
  },[])

  // const [count, setCount] = useState(0)
  // const render = () => setCount(count + 1)

  return (
    <div className={style.rightSideBar}>
      <div className={style.utilMenuBar}>
        <li className={(utilMenuState === "MyProjects") ? style.selectedUtilItem : style.utilItem}
          onClick={event => selectUtilMenuItem(event, "MyProjects")}>
          <FontAwesomeIcon icon={faFolderTree} className={style.icon} />
          {/* <img src={MyProjectsIcon} alt="My Projects Icon" /> */}
          <span>My Projects</span>
        </li>
        {/* <li className={(utilMenuState === "Mark") ? style.selectedUtilItem : style.utilItem}
          onClick={event => selectUtilMenuItem(event, "Mark")}>
          <FontAwesomeIcon icon={faStar} className={style.icon} />
          <span>Mark</span>
        </li> */}
        <div className={style.line}></div>

        <li
          className={style.utilItem}
          onClick={ProjectManager.createNewProject}
        >
          <FontAwesomeIcon icon={faFileMedical} className={style.icon} />
          {/* <img src={ComputerIcon} alt="Open Directory Icon" /> */}
          <span>Create New Project</span>
        </li>
        <li
          className={style.utilItem}
          onClick={ProjectManager.openLocalProject}
        >
          <FontAwesomeIcon icon={faLaptopFile} className={style.icon} />
          {/* <img src={ComputerIcon} alt="Open Directory Icon" /> */}
          <span>Open Project</span>
        </li>
        <li
          className={style.utilItem}
          onClick={ProjectManager.openLocalProjectsHome}
        >
          <FontAwesomeIcon icon={faHouseLaptop} className={style.icon}  />
          {/* <img src={ComputerIcon} alt="Open Directory Icon" /> */}
          <span>Open Project Home</span>
        </li>
        <li
          className={(boolHasProjectHomeDirectory) ? style.utilItem : style.disabledUtilItem}
          onClick={(boolHasProjectHomeDirectory) ? ProjectManager.reloadProjectHomeDirectoryHandle : () => { }}
        >
          <FontAwesomeIcon icon={faArrowsRotate} className={style.icon} />
          {/* <img src={AshcanIcon} alt="Renew Icon" /> */}
          <span>Reload Project Home</span>
        </li>
      </div>
    </div>
  )
}

