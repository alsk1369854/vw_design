import React, { memo } from 'react'
import { Link } from 'react-router-dom';
import style from './index.module.scss';

import { Test } from '../../tools/Test';




const HomePage = memo(() => {
    return (
        <div
            className={style.div}
            data-testid={Test.setTestId("HomePage")}
        >
            <span>Home Page</span>
            <br/>
            <Link
                to="/ProjectManage"
                data-testid={Test.setTestId("linkProjectManagePage")}
            >
                Go to Project Manage Page
            </Link>
            <br/>
            <Link
                to="/Edit"
                data-testid={Test.setTestId("linkEditPage")}
            >
                Go to Edit Page
            </Link>
            <br/>
        </div>
    )
});

export default HomePage;