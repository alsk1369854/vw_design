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
                    onContextMenu={event => openProjectContextMenu(event, projectInfo.id)}
                    onClick={() => console.log(`open ${projectInfo.id}`)}
                >
                    <span className={style.itemName}><img src={projectInfo.iconSrc} alt="icon" />{projectInfo.name}</span>
                    <span className={style.itemOwner}>{projectInfo.owner}</span>
                    <span className={style.itemLastTime}>{projectInfo.lastEditTime}</span>
                </li>
                <div className={style.line}></div>
            </>
        )
    }
}
