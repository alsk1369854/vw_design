import React from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Test } from '../../tools/Test';
import HeaderStyle from '../Edit/index.module.scss'
import logo from '../../assets/logo.png';
import ToolBar from '../../components/ToolBar';
import ProjectListFrame from '../../components/ProjectListFrame'

const cssHelmet = `
    html, body, #app {
        /* 將高度展開為 100% (全螢幕) */
        height: 100%;

        background-color: #757575;
        color: white;

        overflow: hidden;
    }

    ::-webkit-scrollbar-track-piece { /* 滾動條凹槽的顏色，還可以設定邊框屬性 */
        background-color: #424242;
    }
    ::-webkit-scrollbar { /* 滾動條的寬度 */
        width: 5px;
        height: 0px;
    }
    ::-webkit-scrollbar-thumb { /* 滾動條的設定 */
        background-color: #c7c7c7;
        background-clip: padding-box;
        border-radius: 30px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background-color: #dbdbdb;
    }
`

export default class ProjectManagePage extends React.Component{

    render(){
        return (
            <div data-testid={Test.setTestId("ProjectManagePage")}>
                <Helmet>
                        <style>
                            {cssHelmet}
                        </style>
                </Helmet>

                {/* Page Header */}
                <div className={HeaderStyle.div} >
                    <header>
                        <Link to="/" className={HeaderStyle.container} data-testid={Test.setTestId("linkHomePage")} >
                            <img id={HeaderStyle.logo} src={logo} />
                        </Link>
                        <ToolBar />
                    </header>
                </div>

                {/* ProjectList */}
                <ProjectListFrame/>
            </div>
        )
    }
}
