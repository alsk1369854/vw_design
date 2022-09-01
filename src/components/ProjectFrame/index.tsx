import React, { Component, useEffect, useState } from 'react'

import ProjectListFrame from './ProjectListFrame'
import SideMenu from './SideMenu'

import FunctionCaller from '../../tools/FunctionCaller'
import style from './index.module.scss'
import { useHref, useNavigate } from 'react-router-dom'

export const FUNCTION_CALLER_KEY_TO_EDIT_PAGE = 'ProjectFrame_toEditPage'

interface IProps { }
interface IState { }

export default function ProjectFrame() {
    const [utilMenuState, setUtilMenuState] = useState("MyProjects")
    const [goToEditPage, setGoToEditPage] = useState(false)

    const routePath = useHref('/Edit');
    const navigate = useNavigate();

    useEffect(() => {
        if (goToEditPage) {
            navigate(routePath)
            setGoToEditPage(false)
        }
        FunctionCaller.set(FUNCTION_CALLER_KEY_TO_EDIT_PAGE, () => setGoToEditPage(true))
        return () => {
            FunctionCaller.remove(FUNCTION_CALLER_KEY_TO_EDIT_PAGE)
        }
    })

    const selectUtilMenuItem = (event: any, strItemName: string) => {
        setUtilMenuState(strItemName)
        console.log("util Menu item: ", strItemName)
    }

    return (
        <div className={style.mainFrame}>

            <ProjectListFrame
                utilMenuState={utilMenuState}
            />

            <SideMenu
                utilMenuState={utilMenuState}
                selectUtilMenuItem={selectUtilMenuItem}
            />
        </div>
    )
}

