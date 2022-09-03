import { memo, useEffect, useState } from 'react';
import style from './index.module.scss';

import React from 'react'

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove, { arrayMoveImmutable } from 'array-move';

import FunctionCaller from '../../../../tools/FunctionCaller';
import FileManager from '../../../FileManager/lib/FileManager';
import type File from '../../../FileManager/lib/File';

/*
// 直接嵌入 array-move arrayMoveImmutable
function arrayMoveMutable(array: any, fromIndex: any, toIndex: any) {
	const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

	if (startIndex >= 0 && startIndex < array.length) {
		const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

		const [item] = array.splice(fromIndex, 1);
		array.splice(endIndex, 0, item);
	}
}
function arrayMoveImmutable(array: any, fromIndex: any, toIndex: any) {
	array = [...array];
	arrayMoveMutable(array, fromIndex, toIndex);
	return array;
}
*/

const SortableItem = SortableElement(({ file, setEditFile }: any) => {
    return (
        <div style={{ marginRight: '10px' }}
            onClick={() => setEditFile(FileManager.getFileById(file.getId()))}
        >
            {file.strFileName}
            <button
                onClick={(event) => {
                    // event.stopPropagation()
                    FileManager.deleteOpenFile(file)
                }}
            >delete</button>
        </div>
    )
});

const SortableList = SortableContainer(({ items, setEditFile }: any) => {
    return (
        <div style={{ display: 'flex' }}>
            {items.map((file: any, index: number) => (
                <SortableItem key={`item-${file.getId()}`} setEditFile={setEditFile} index={index} file={file} />
            ))}
        </div>
    );
});

interface IState { }

interface IProps {
    setEditFile: Function
}

export const FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_BAR = 'MainFrame/EditArea/OpenedFileBar: update'
export const FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS = 'MainFrame/EditArea/OpenedFileBar: updateOpenFileItems'
export const FUNCTION_CALLER_KEY_GET_OPEN_FILE_ITEMS = 'MainFrame/EditArea/OpenedFileBar: getOpenFileItems'
export const FUNCTION_CALLER_KEY_SET_OPEN_FILE_ITEMS = 'MainFrame/EditArea/OpenedFileBar: setOpenFileItems'

export default function OpenedFileBar({ setEditFile }: IProps) {
    const [count, setCount] = useState(0)
    const render = () => setCount(count + 1)

    const [openFileItems, setOpenFileItems] = useState<File[]>(FileManager.getOpenFiles())

    const updateOpenFileItems = (arrFile: File[]) => {
        setOpenFileItems(arrFile)
        render()
    }

    useEffect(() => {
        // FunctionCaller.set(FUNCTION_CALLER_KEY_GET_OPEN_FILE_ITEMS, this.getOpenFileItems)
        FunctionCaller.set(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_ITEMS, updateOpenFileItems)
        return () => {
            // FunctionCaller.remove(FUNCTION_CALLER_KEY_GET_OPEN_FILE_ITEMS)
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
           <SortableList
                setEditFile={setEditFile}
                distance={1}
                lockAxis="x"
                axis='x'
                items={openFileItems}
                onSortEnd={onSortEnd}
            />
        </div>
    )
}
