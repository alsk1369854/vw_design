import { memo } from 'react';
import style from './index.module.scss';
<<<<<<< HEAD
=======
import EditorFrame from './EditorFrame';
>>>>>>> origin_ssh/CodeEditor


const CodeEditor = memo(() => {
    return (
        <div
            className={style.div}
        >
<<<<<<< HEAD
            CE
=======
            <EditorFrame strPathName="./index.html" strCode="" strLang="js" strTheme="dark"/>
>>>>>>> origin_ssh/CodeEditor
        </div>
    )
})

export default CodeEditor;