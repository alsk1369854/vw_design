import { memo } from 'react';
import style from './index.module.scss';


const CodeEditor = memo(() => {
    return (
        <div
            className={style.div}
        >
            CE
        </div>
    )
})

export default CodeEditor;