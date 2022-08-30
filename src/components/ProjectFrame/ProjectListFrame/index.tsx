import React, { Component } from 'react'

import ContextMenu from './ContextMenu'
import ProjectItem from './ProjectItem'
import type IProjectInfo from '../lib/IProjectInfo'

import style from './index.module.scss'
import { click } from '@testing-library/user-event/dist/click'
interface IProps {
  utilMenuState: string
}

export default class ProjectListFrame extends Component<IProps> {
  state = {
    showContextMenu: false,
    showContextProjectId: "",
    mouseDownXY: { x: 0, y: 0 },
  }

  documentOnClick = () => {
    this.setState({ showContextMenu: false })
  }
  componentDidMount() {
    document.addEventListener('click', this.documentOnClick)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.documentOnClick)
  }

  openProjectContextMenu = (event: any, id: string) => {
    event.stopPropagation()
    event.preventDefault();
    this.setState({
      showContextMenu: true,
      showContextProjectId: id,
      mouseDownXY: { x: event.pageX, y: event.pageY }
    })
    console.log("click item: ", id);
  }

  // selectUtilMenuItem = (event: any, strItemName: string) => {
  //   this.setState({ utilMenuState: strItemName })
  //   console.log("util Menu item: ", strItemName)
  // }

  render() {
    const { showContextMenu } = this.state
    const { utilMenuState } = this.props

    const arrProjectList: IProjectInfo[] = []
    arrProjectList.push({
      id: '1',
      name: 'project01',
      iconSrc: 'https://picsum.photos/100/100',
      owner: 'Ming',
      lastEditTime: '2020/06/03 01:05:30'
    })
    arrProjectList.push({
      id: '2',
      name: 'project02',
      iconSrc: 'https://picsum.photos/50/50',
      owner: 'Ming',
      lastEditTime: '2020/06/03 01:05:30'
    })

    return (
      <>
        {showContextMenu ? <ContextMenu projectId={this.state.showContextProjectId} x={this.state.mouseDownXY.x} y={this.state.mouseDownXY.y} /> : <></>}
        <div className={style.ProjectListBar}>
          <div className={style.listHeaderBar}>
            <div className={style.headerNameTitle}>Name</div>
            <div className={style.headerOwnerTitle}>Owner</div>
            <div className={style.headerLastTimeTitle}>Last Modified Time</div>
          </div>
          <div className={style.line}></div>
          <div className={style.listMenuBar} >

            {arrProjectList.map(projectInfo =>
              <ProjectItem
                key={`ProjectItem_${projectInfo.id}`}
                openProjectContextMenu={this.openProjectContextMenu}
                projectInfo={projectInfo}
              />
            )}

          </div>
        </div>
      </>
    )
  }
}
