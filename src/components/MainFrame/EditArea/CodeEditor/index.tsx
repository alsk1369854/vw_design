import { memo, useState } from 'react';
import style from './index.module.scss';
import Editor from './Editor';
import File from '../../../FileManager/lib/File';


const CodeEditor = memo((props:{objFileEditFile:File}) => {

    const setCode = (value:string)=>{
        props.objFileEditFile.setData(value);
    };

    return (
        <div
            className={style.div}
        >
            <Editor strLang={props.objFileEditFile.strFileName.split('.')[1]} strCode = {props.objFileEditFile.getData()} onChange = {setCode}/>
        </div>
    )
})

export default CodeEditor;