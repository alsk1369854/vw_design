import React, { memo } from 'react'
import { Link } from 'react-router-dom';

import { Test } from '../../tools/Test';




const ProjectManagePage = memo(() => {
    return (
        <div
            data-testid={Test.setTestId("ProjectManagePage")}
        >
            <span>Project Manage Page</span>
            <br/>
            <Link
                to="/"
                data-testid={Test.setTestId("linkHomePage")}
            >
                Go back
            </Link>
        </div>
    )
});

export default ProjectManagePage;