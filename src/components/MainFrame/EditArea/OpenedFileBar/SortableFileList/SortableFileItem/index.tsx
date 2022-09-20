import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { SortableElement } from "react-sortable-hoc";
import FileManager from "../../../../../FileManager/lib/FileManager";

import style from './index.module.scss'

export const SortableFileItem = SortableElement((props: { file: any, setEditFile: Function }) => {
    return (
        <div className={style.fileItem}
            onClick={() => props.setEditFile(FileManager.getFileById(props.file.getId()))}
        >
            <div className={style.fileIconBar}>
                {FileManager.getFileIcon(props.file)}
            </div>

            <div className={style.fileName}>
                {props.file.strFileName}
            </div>

            <div className={style.deleteIconContainer}
                onClick={(event) => FileManager.deleteOpenFile(props.file)}
            >
                <FontAwesomeIcon icon={faXmark}
                    className={style.deleteIcon}
                />

            </div>
        </div>
    )
});