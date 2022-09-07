import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { SortableElement } from "react-sortable-hoc";
import FileManager from "../../../../../FileManager/lib/FileManager";

import style from './index.module.scss'

export const SortableFileItem = SortableElement(({ file, setEditFile }: any) => {
    return (
        <div className={style.fileItem}
            onClick={() => setEditFile(FileManager.getFileById(file.getId()))}
        >
            <div className={style.fileIconBar}>
                {FileManager.getFileIcon(file)}
            </div>

            <div className={style.fileName}>
                {file.strFileName}
            </div>

            <div className={style.deleteIconContainer}
                onClick={(event) => FileManager.deleteOpenFile(file)}
            >
                <FontAwesomeIcon icon={faXmark}
                    className={style.deleteIcon}
                />

            </div>
        </div>
    )
});