import { memo } from 'react';
import style from './index.module.scss';
import EditorFrame from './EditorFrame';


const CodeEditor = memo(() => {
    return (
        <div
            className={style.div}
        >
            <EditorFrame strPathName="./index.html" strCode="" strLang="js" strTheme="dark"/>
        </div>
    )
})

export default CodeEditor;