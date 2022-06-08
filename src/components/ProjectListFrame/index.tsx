import React, { Component } from 'react'
// import { Container, Row, Col, Button } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// icons 
import MyProjectsIcon from '../../assets/icon/Folder_gray.png'
import MarkIcon from '../../assets/icon/Star_gray.png'
import AshcanIcon from '../../assets/icon/Ashcan_gray.png'
import ComputerIcon from '../../assets/icon/Computer_gray.png'

import ContextMenu from './ContextMenu'
import style from './index.module.scss'




export default class ProjectListFrame extends Component {
    state = {
        showContextProjectId: undefined,
        showContextMenu: false,
        mouseDownXY: { x: 0, y: 0 },
        utilMenuState: "MyProjects"
    }


    // onContextMenu = (event:any) =>{
    //     alert("contextMenu")
    //     console.log(event)
    // }

    openProjectContextMenu = (event: any, id: string) => {
        event.stopPropagation()
        this.setState({
            showContextMenu: true,
            showContextProjectId: id,
            mouseDownXY: { x: event.pageX, y: event.pageY }
        })
        // console.log(event);
        console.log("click item: ", id);
    }

    closeProjectContextMenu = () => {
        this.setState({ showContextMenu: false })
    }

    selectUtilMenuItem = (event: any, strItemName: string) => {
        this.setState({ utilMenuState: strItemName })
        console.log("util Menu item: ", strItemName)
    }

    render() {
        return (
            <div className={style.mainFrame} onClick={this.closeProjectContextMenu}>
                {this.state.showContextMenu ? <ContextMenu x={this.state.mouseDownXY.x} y={this.state.mouseDownXY.y} /> : <></>}
                <div className={style.leftSideBar}>
                    <div className={style.listHeaderBar}>
                        <div className={style.headerNameTitle}>Name</div>
                        <div className={style.headerOwnerTitle}>Owner</div>
                        <div className={style.headerLastTimeTitle}>Last Modified Time</div>
                    </div>
                    <div className={style.line}></div>
                    <div className={style.listMenuBar}>

                        <li className={style.listItem} onClick={event => this.openProjectContextMenu(event, "1")}>
                            <span className={style.itemName}><img src="https://picsum.photos/100/100" alt="icon" />project01</span>
                            <span className={style.itemOwner}>Ming</span>
                            <span className={style.itemLastTime}>2020/06/03 01:05:30</span>
                        </li>
                        <div className={style.line}></div>

                        <li className={style.listItem} onClick={event => this.openProjectContextMenu(event, "2")}>
                            <span className={style.itemName}><img src="https://picsum.photos/50/50" alt="icon" />project02</span>
                            <span className={style.itemOwner}>Ming</span>
                            <span className={style.itemLastTime}>2020/06/03 01:05:30</span>
                        </li>
                        <div className={style.line}></div>

                    </div>
                </div>
                <div className={style.rightSideBar}>
                    <div className={style.utilMenuBar}>
                        <li className={(this.state.utilMenuState === "MyProjects") ? style.selectedUtilItem : style.utilItem}
                            onClick={event => this.selectUtilMenuItem(event, "MyProjects")}>
                            <img src={MyProjectsIcon} alt="My Projects Icon" />
                            <span>My Projects</span>
                        </li>
                        <li className={(this.state.utilMenuState === "Mark") ? style.selectedUtilItem : style.utilItem}
                            onClick={event => this.selectUtilMenuItem(event, "Mark")}>
                            <img src={MarkIcon} alt="Mark Icon" />
                            <span>Mark</span>
                        </li>
                        <div className={style.line}></div>
                        <li className={style.utilItem}>
                            <img src={ComputerIcon} alt="Computer Icon" />
                            <span>Computer</span>
                        </li>
                        <li className={style.utilItem}>
                            <img src={AshcanIcon} alt="Ashcan Icon" />
                            <span>Delete</span>
                        </li>
                    </div>
                </div>
            </div>
        )
    }
}
