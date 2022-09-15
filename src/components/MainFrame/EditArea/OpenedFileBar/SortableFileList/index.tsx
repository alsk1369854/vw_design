import { SortableContainer } from "react-sortable-hoc";
import { SortableFileItem } from "./SortableFileItem";

import style from './index.module.scss'

export const SortableFileList = SortableContainer(({ items, setEditFile }: any) => {
    return (
        <div className={style.fileItemBar}>
            {items.map((file: any, index: number) => (
                <SortableFileItem key={`OpenedFileBar_SortableFileItem-${file.getId()}`} setEditFile={setEditFile} index={index} file={file} />
            ))}
        </div>
    );
});