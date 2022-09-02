import React, { Component } from 'react'

import type { IProjectInfo } from '../../lib/IProjectInfo'

import style from './index.module.scss'

interface IProps {
    openProjectContextMenu: Function,
    projectInfo: IProjectInfo
}

export default class projectItem extends Component<IProps> {
    render() {
        const {
            openProjectContextMenu,
            projectInfo,
        } = this.props
        return (
            <>
                <li
                    className={style.listItem}
                    onContextMenu={event => openProjectContextMenu(event, projectInfo.strId)}
                    onClick={() => console.log(`open ${projectInfo.strId}`)}
                >
                    <span className={style.itemName}><img src={projectInfo.strIconSrc} alt="icon" />{projectInfo.strName}</span>
                    <span className={style.itemOwner}>{projectInfo.strOwner}</span>
                    <span className={style.itemLastTime}>{projectInfo.strLastEditTime}</span>
                </li>
                <div className={style.line}></div>
            </>
        )
    }
}
