import React, { Component } from 'react'
// import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import ContextMenu from '../ContextMenu'

import style from './index.module.scss'

export default class ProjectListFrame extends Component {
    state = {
        showContextProjectId: undefined,
        showContextMenu: false,
        mouseDownXY: { x: 0, y: 0 }
    }


    // onContextMenu = (event:any) =>{
    //     alert("contextMenu")
    //     console.log(event)
    // }

    openProjectContextMenu = (event: any, id: string) => {
        this.setState({
            showContextMenu: true,
            showContextProjectId: id,
            mouseDownXY: { x: event.pageX, y: event.pageY }
        })
        console.log(event);
        console.log(id);
    }

    render() {
        return (
            <div className={style.mainFrame}>
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
                            <span className={style.itemName}><img src="https://picsum.photos/50/50" alt="pjImg" />project01</span>
                            <span className={style.itemOwner}>Ming</span>
                            <span className={style.itemLastTime}>2020/06/03 01:05:30</span>
                        </li>
                        <div className={style.line}></div>

                        <li className={style.listItem} onClick={event => this.openProjectContextMenu(event, "2")}>
                            <span className={style.itemName}><img src="https://picsum.photos/50/50" alt="pjImg" />project02</span>
                            <span className={style.itemOwner}>Ming</span>
                            <span className={style.itemLastTime}>2020/06/03 01:05:30</span>
                        </li>
                        <div className={style.line}></div>

                    </div>
                </div>
                <div className={style.rightSideBar}>
                    <div className={style.utilMenuBar}>
                        <li className={style.utilItem}>
                            <img src="https://picsum.photos/35/35" alt="myProjectIcon" />
                            <span>My Project</span>
                        </li>
                        <li className={style.utilItem}>
                            <img src="https://picsum.photos/35/35" alt="ashCanIcon" />
                            <span>Ashcan</span>
                        </li>
                    </div>
                </div>
            </div>
        )
    }
}
