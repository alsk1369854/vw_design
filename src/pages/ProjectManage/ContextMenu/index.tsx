import React, { Component } from 'react'

import style from './index.module.scss'

interface IState { }

interface IProps {
  x: string | number,
  y: string | number,
}

export default class ContextMenu extends Component<IProps, IState> {
  render() {
    console.log(this.props)
    return (
      <ul
        className={style.projectContextMenu}
        style={{
          top: this.props.y,
          left: this.props.x
        }}
      >
        <li>Share to..</li>
        <li>Cut</li>
        <li>Copy</li>
        <li>Paste</li>
        <hr className="divider" />
        <li>Refresh</li>
        <li>Exit</li>
      </ul>

    )
  }
}