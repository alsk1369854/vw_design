import { useEffect, useState } from 'react';
import style from './index.module.scss';

import React from 'react'

import { arrayMoveImmutable } from 'array-move';

import FunctionCaller from '../../../../tools/FunctionCaller';
import FileManager from '../../../FileManager/lib/FileManager';
import type File from '../../../FileManager/lib/File';
import { SortableFileList } from './SortableFileList';


export const FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS = 'MainFrame/EditArea/OpenedFileBar: updateOpenFileItems'

export default function OpenedFileBar(props: { setEditFile: Function }) {
    const [count, setCount] = useState(0)
    const render = () => setCount(count + 1)

    const [openFileItems, setOpenFileItems] = useState<File[]>(FileManager.getOpenFiles())

    const updateOpenFileItems = (arrFile: File[]) => {
        setOpenFileItems(arrFile)
        render()
    }

    useEffect(() => {
        FunctionCaller.set(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS, updateOpenFileItems)
        return () => {
            FunctionCaller.remove(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS)
        }
    })

    const onSortEnd = ({ oldIndex, newIndex }: any) => {
        const newOpenFileItems = arrayMoveImmutable(openFileItems, oldIndex, newIndex)
        FileManager.setOpenFiles(newOpenFileItems)
        setOpenFileItems(newOpenFileItems)
    };

    // console.log('Opened render')
    return (
        <div className={style.div}>
            <SortableFileList
                axis={'x'}
                // @ts-ignore
                setEditFile={props.setEditFile}
                distance={1}
                lockAxis="x"
                items={openFileItems}
                onSortEnd={onSortEnd}
            />
        </div>
    )
}



// // 直接嵌入 array-move arrayMoveImmutable
// function arrayMoveMutable(array: any, fromIndex: any, toIndex: any) {
// 	const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

// 	if (startIndex >= 0 && startIndex < array.length) {
// 		const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

// 		const [item] = array.splice(fromIndex, 1);
// 		array.splice(endIndex, 0, item);
// 	}
// }
// function arrayMoveImmutable(array: any, fromIndex: any, toIndex: any) {
// 	array = [...array];
// 	arrayMoveMutable(array, fromIndex, toIndex);
// 	return array;
// }