import React, { Component } from 'react'

import style from './index.module.scss'
import OpenIcon from '../../../assets/icon/Open.png'
import DownloadIcon from '../../../assets/icon/Download.png'
import CopyIcon from '../../../assets/icon/Copy.png'
import RenameIcon from '../../../assets/icon/Rename.png'
import MarkIcon from '../../../assets/icon/Star.png'
import DetailIcon from '../../../assets/icon/Detail.png'
import AshcanIcon from '../../../assets/icon/Ashcan.png'

interface IState { }

interface IProps {
  x: string | number,
  y: string | number,
}

export default class ContextMenu extends Component<IProps, IState> {
  render() {
    // console.log(this.props)
    return (
      <ul className={style.projectContextMenu}
        style={{
          top: this.props.y,
          left: this.props.x
        }}
      >
        <li>
          <img src={OpenIcon} alt="Open icon" />
          <span>Open</span>
        </li>
        <li>
          <img src={DownloadIcon} alt="Download icon" />
          <span>Download</span>
        </li>
        <li>
          <img src={CopyIcon} alt="Copy icon"></img>
          <span>Copy</span>
        </li>
        <li>
          <img src={MarkIcon} alt=" Mark icon" /> 
          <span>Mark</span>
        </li>
        <li>
          <img src={RenameIcon} alt="Rename icon" />
          <span>Rename</span>
        </li>
        <li>
          <img src={DetailIcon} alt="Detail icon" />
          <span>Detail</span>
        </li>
        <div className={style.line}></div>
        {/* <hr className="divider" /> */}
        <li>
          <img src={AshcanIcon} alt="Delete icon" />
          <span>Delete</span>
        </li>
      </ul>

    )
  }
}