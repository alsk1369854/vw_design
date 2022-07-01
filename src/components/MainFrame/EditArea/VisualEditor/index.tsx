import { CSSProperties, memo } from 'react';
import style from './index.module.scss';


const VisualEditor = memo(() => {
    return (
        <div
            className={style.div}
        >
            VE
        </div>
    )
})

export default VisualEditor;