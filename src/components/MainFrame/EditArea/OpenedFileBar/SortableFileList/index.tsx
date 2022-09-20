import { SortableContainer } from "react-sortable-hoc";
import { SortableFileItem } from "./SortableFileItem";

import style from './index.module.scss'

export const SortableFileList = SortableContainer((props: { items: Array<any>, setEditFile: Function }) => {
    return (
        <div className={style.fileItemBar}>
            {props.items.map((file: any, index: number) => (
                // @ts-ignore
                <SortableFileItem key={`OpenedFileBar_SortableFileItem-${file.getId()}`} setEditFile={props.setEditFile} index={index} file={file} />
            ))}
        </div>
    );
});
