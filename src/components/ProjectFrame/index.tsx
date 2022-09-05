import React, { useState } from 'react'

import ProjectListFrame from './ProjectListFrame'
import SideMenu from './SideMenu'

import style from './index.module.scss'

// interface IProps { }
// interface IState { }

export default function ProjectFrame() {
    const [utilMenuState, setUtilMenuState] = useState("MyProjects")

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

