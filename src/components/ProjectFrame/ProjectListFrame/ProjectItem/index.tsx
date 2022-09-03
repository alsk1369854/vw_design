import React, { Component } from 'react'

import type { IProjectContents, IProjectState } from '../../lib/ProjectInterfaceCollection'
import ProjectManager from '../../lib/ProjectManager'

import style from './index.module.scss'

interface IProps {
    openProjectContextMenu: Function,
    projectState: IProjectState
}

export default function projectItem({
    openProjectContextMenu,
    projectState,
}: IProps) {
    const { contents } = projectState

    const editing = () => {
        ProjectManager.setEditingProjectState(projectState)
        ProjectManager.toEditPage()
    }

    return (
        <>
            <li
                className={style.listItem}
                onContextMenu={event => openProjectContextMenu(event, contents!.strId)}
                onClick={editing}
            >
                <span className={style.itemName}>
                    <img src={contents!.strIconSrc} alt="icon" />
                    {contents!.strName}
                </span>
                <span className={style.itemOwner}>
                    {contents!.strOwner}
                    </span>
                <span className={style.itemLastTime}>
                    {contents!.strLastEditTime}
                    </span>
            </li>
            <div className={style.line}></div>
        </>
    )
}

