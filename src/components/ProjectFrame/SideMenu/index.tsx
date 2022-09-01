import React, { useEffect, useState } from 'react'
import { useHref, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFolderTree, // my Project 
  faStar, // mark 
  faFolderOpen, // open Projects Directory
  faArrowsRotate, // renew
  faFileMedical, // create project
  faLaptopFile, // open Project
  faHouseLaptop, // open projects house
  faArrowUpRightFromSquare, // open
  faFileArrowDown, // download
  faScissors, // cut
  faCopy, // copy
  faPaste, // paste
  faSignature, // rename
  faTrashCan, // delete
} from '@fortawesome/free-solid-svg-icons'

import style from './index.module.scss'
import ProjectManager from '../lib/ProjectManager'

interface IProps {
  utilMenuState: string,
  selectUtilMenuItem: Function,
}

export default function SideMenu({
  utilMenuState,
  selectUtilMenuItem
}: IProps) {

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
        <li className={(utilMenuState === "Mark") ? style.selectedUtilItem : style.utilItem}
          onClick={event => selectUtilMenuItem(event, "Mark")}>
          <FontAwesomeIcon icon={faStar} className={style.icon} />
          {/* <img src={MarkIcon} alt="Mark Icon" /> */}
          <span>Mark</span>
        </li>
        <div className={style.line}></div>

        <li
          className={style.utilItem}
          onClick={ProjectManager.createProject}
        >
          <FontAwesomeIcon icon={faFileMedical} className={style.icon} />
          {/* <img src={ComputerIcon} alt="Open Directory Icon" /> */}
          <span>Create Project</span>
        </li>
        <li className={style.utilItem}>
          <FontAwesomeIcon icon={faLaptopFile} className={style.icon} />
          {/* <img src={ComputerIcon} alt="Open Directory Icon" /> */}
          <span>Open Project</span>
        </li>
        <li className={style.utilItem}>
          <FontAwesomeIcon icon={faHouseLaptop} className={style.icon} />
          {/* <img src={ComputerIcon} alt="Open Directory Icon" /> */}
          <span>Open Projects House</span>
        </li>
        <li className={style.utilItem}>
          <FontAwesomeIcon icon={faArrowsRotate} className={style.icon} />
          {/* <img src={AshcanIcon} alt="Renew Icon" /> */}
          <span>Renew</span>
        </li>
      </div>
    </div>
  )
}

