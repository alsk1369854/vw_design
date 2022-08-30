import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFolderTree, // my Project 
  faStar, // mark 
  faFolderOpen, // open Directory
  faArrowsRotate, // renew
  faArrowUpRightFromSquare, // open
  faFileArrowDown, // download
  faScissors, // cut
  faCopy, // copy
  faPaste, // paste
  faSignature, // rename
  faTrashCan, // delete
} from '@fortawesome/free-solid-svg-icons'


// icons 
import MyProjectsIcon from '../../../assets/icon/Folder_gray.png'
import MarkIcon from '../../../assets/icon/Star_gray.png'
import AshcanIcon from '../../../assets/icon/Ashcan_gray.png'
import ComputerIcon from '../../../assets/icon/Computer_gray.png'

import style from './index.module.scss'

interface IProps {
  utilMenuState: string,
  selectUtilMenuItem: Function,
}

export default class SideMenu extends Component<IProps> {
  render() {
    const {
      utilMenuState,
      selectUtilMenuItem
    } = this.props
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
          <li className={style.utilItem}>
            <FontAwesomeIcon icon={faFolderOpen} className={style.icon} />
            {/* <img src={ComputerIcon} alt="Open Directory Icon" /> */}
            <span>Open Directory</span>
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
}
