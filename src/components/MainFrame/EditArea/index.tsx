import { CSSProperties, memo, useState } from 'react';
import style from './index.module.scss';

import OpenedFileBar from './OpenedFileBar';
import VisualEditor from './VisualEditor';
import CodeEditor from './CodeEditor/index';
import FileManager from '../../FileManager/lib/FileManager';


const EditArea = memo((props: {intWidth: number}) => {
    const [strUseState, setUseState] = useState("VisualEditor");
    const [objFileEditFile, setEditFile] = useState(FileManager.getRootFile());


    const cssClickedButton: CSSProperties = {
        backgroundColor: "#585858",
    }
    const cssContainer: CSSProperties = {
        width: props.intWidth,
    }
    return (
        <div
            style={cssContainer}
            className={style.div}
        >
            <nav>
                <OpenedFileBar setEditFile={setEditFile}/>
                <button
                >
                    <img src={require("../../../assets/icon/Preview.png")} />
                </button>
                <button
                    style={(strUseState === "CodeEditor")? cssClickedButton : undefined}
                    onClick={() => setUseState("CodeEditor")}
                >
                    <img src={require("../../../assets/icon/Code.png")} />
                </button>
                <button
                    style={(strUseState === "VisualEditor")? cssClickedButton : undefined}
                    onClick={() => setUseState("VisualEditor")}
                >
                    <img src={require("../../../assets/icon/Move.png")} />
                </button>
            </nav>
            {(strUseState === "CodeEditor")? <CodeEditor objFileEditFile={objFileEditFile}/> : <VisualEditor />}
        </div>
    )
})

export default EditArea;