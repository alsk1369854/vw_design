import React, { memo } from 'react'
import { Link } from 'react-router-dom';

import { Test } from '../../tools/Test';




const NotMatchPage = memo(() => {
    return (
        <div>
            <span>404 Sorry this page is't exist.</span>
        </div>
    )
});

export default NotMatchPage;