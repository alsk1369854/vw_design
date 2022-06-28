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


interface IProps {
    showContextMenu: boolean,
    openProjectContextMenu: Function,
}

interface IState { }

export default class ProjectListFrame extends Component<IProps, IState> {
    state = {
        showContextProjectId: "",
        mouseDownXY: { x: 0, y: 0 },
        utilMenuState: "MyProjects"
    }


    // onContextMenu = (event:any) =>{
    //     alert("contextMenu")
    //     console.log(event)
    // }

    openProjectContextMenu = (event: any, id: string) => {
        event.stopPropagation()
        event.preventDefault();
        this.setState({
            showContextProjectId: id,
            mouseDownXY: { x: event.pageX, y: event.pageY }
        })
        this.props.openProjectContextMenu()
        console.log("click item: ", id);
    }

    selectUtilMenuItem = (event: any, strItemName: string) => {
        this.setState({ utilMenuState: strItemName })
        console.log("util Menu item: ", strItemName)
    }

    render() {
        // console.log(this.state)
        return (
            <div className={style.mainFrame}>
                {this.props.showContextMenu ? <ContextMenu projectId={this.state.showContextProjectId} x={this.state.mouseDownXY.x} y={this.state.mouseDownXY.y} /> : <></>}
                <div className={style.leftSideBar}>
                    <div className={style.listHeaderBar}>
                        <div className={style.headerNameTitle}>Name</div>
                        <div className={style.headerOwnerTitle}>Owner</div>
                        <div className={style.headerLastTimeTitle}>Last Modified Time</div>
                    </div>
                    <div className={style.line}></div>
                    <div className={style.listMenuBar} >

                        <li className={style.listItem} onContextMenu={event => this.openProjectContextMenu(event, "1")} onClick={()=> console.log("open 1")}>
                            <span className={style.itemName}><img src="https://picsum.photos/100/100" alt="icon" />project01</span>
                            <span className={style.itemOwner}>Ming</span>
                            <span className={style.itemLastTime}>2020/06/03 01:05:30</span>
                        </li>
                        <div className={style.line}></div>

                        <li className={style.listItem} onContextMenu={event => this.openProjectContextMenu(event, "2")} onClick={()=> console.log("open 2")}>
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
