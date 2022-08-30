import React, { Component } from 'react'
// import { Container, Row, Col, Button } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// icons 
import MyProjectsIcon from '../../assets/icon/Folder_gray.png'
import MarkIcon from '../../assets/icon/Star_gray.png'
import AshcanIcon from '../../assets/icon/Ashcan_gray.png'
import ComputerIcon from '../../assets/icon/Computer_gray.png'

import ProjectListFrame from './ProjectListFrame'
import SideMenu from './SideMenu'

// import ContextMenu from './ContextMenu'
import style from './index.module.scss'


interface IProps {
    showContextMenu: boolean,
    openProjectContextMenu: Function,
}

interface IState { }

export default class ProjectFrame extends Component<IProps, IState> {
    state = {
        // showContextProjectId: "",
        // mouseDownXY: { x: 0, y: 0 },
        utilMenuState: "MyProjects"
    }

    selectUtilMenuItem = (event: any, strItemName: string) => {
        this.setState({ utilMenuState: strItemName })
        console.log("util Menu item: ", strItemName)
    }

    render() {
        // console.log(this.state)
        const { utilMenuState } = this.state
        return (
            <div className={style.mainFrame}>

                <ProjectListFrame
                    utilMenuState={utilMenuState}
                />

                <SideMenu
                    utilMenuState={utilMenuState}
                    selectUtilMenuItem={this.selectUtilMenuItem}
                />
            </div>
        )
    }
}
