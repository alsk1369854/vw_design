import { memo } from 'react';
import style from './index.module.scss';


const OpenedFileBar = memo(() => {
    return (
        <div className={style.div}>
            OF
        </div>
    )
})

export default OpenedFileBar;